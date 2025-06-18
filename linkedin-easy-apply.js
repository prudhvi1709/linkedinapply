(function () {
  "use strict";

  const state = {
    appliedCount: 0,
    skippedCount: 0,
    errorCount: 0,
    totalJobs: 0,
    isRunning: false,
    shouldStop: false,
  };

  const UI = {
    createOverlay() {
      const overlay = document.createElement("div");
      overlay.id = "linkedin-apply-overlay";
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      const modal = document.createElement("div");
      modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
      `;

      modal.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #0a66c2;">LinkedIn Easy Apply Bot</h3>
        <div id="apply-status" style="margin-bottom: 20px;">
          <div style="margin-bottom: 10px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Status: <span id="current-status">Starting...</span></div>
            <div style="background: #f3f2ef; border-radius: 4px; height: 8px; overflow: hidden;">
              <div id="progress-bar" style="background: #0a66c2; height: 100%; width: 0%; transition: width 0.3s;"></div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px;">
            <span>Applied: <strong id="applied-count">0</strong></span>
            <span>Skipped: <strong id="skipped-count">0</strong></span>
            <span>Errors: <strong id="error-count">0</strong></span>
          </div>
        </div>
        <button id="stop-btn" style="
          background: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        ">Stop</button>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      document.getElementById("stop-btn").onclick = () => {
        state.shouldStop = true;
        document.getElementById("current-status").textContent = "Stopping...";
        document.getElementById("stop-btn").disabled = true;
      };

      return overlay;
    },

    updateStatus(status, progress = null) {
      const statusEl = document.getElementById("current-status");
      const progressBar = document.getElementById("progress-bar");

      if (statusEl) statusEl.textContent = status;
      if (progressBar && progress !== null) progressBar.style.width = `${progress}%`;

      document.getElementById("applied-count").textContent = state.appliedCount;
      document.getElementById("skipped-count").textContent = state.skippedCount;
      document.getElementById("error-count").textContent = state.errorCount;
    },

    removeOverlay() {
      const overlay = document.getElementById("linkedin-apply-overlay");
      if (overlay) overlay.remove();
    },

    showSummary() {
      const total = state.appliedCount + state.skippedCount + state.errorCount;
      alert(
        `LinkedIn Easy Apply Complete!\n\n` +
          `Applied: ${state.appliedCount}\n` +
          `Skipped: ${state.skippedCount}\n` +
          `Errors: ${state.errorCount}\n` +
          `Total processed: ${total}`,
      );
    },
  };

  const Utils = {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    waitForElement(selector, timeout = 5000) {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);

        const observer = new MutationObserver(() => {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve(element);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
      });
    },

    scrollIntoView(element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    },
  };

  const LinkedIn = {
    getJobCards() {
      return Array.from(document.querySelectorAll("[data-occludable-job-id]")).filter((card) => {
        const rect = card.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0;
      });
    },

    async clickJobCard(jobCard) {
      Utils.scrollIntoView(jobCard);
      await Utils.sleep(500);
      jobCard.click();
      await Utils.sleep(1000);
    },

    async hasEasyApply() {
      try {
        await Utils.waitForElement(".jobs-apply-button, .jobs-s-apply button", 3000);
        const applyButton = document.querySelector(".jobs-apply-button, .jobs-s-apply button");
        return applyButton && applyButton.textContent.includes("Easy Apply");
      } catch {
        return false;
      }
    },

    async clickEasyApply() {
      const applyButton = document.querySelector(".jobs-apply-button, .jobs-s-apply button");
      if (!applyButton) throw new Error("Apply button not found");

      applyButton.click();
      await Utils.sleep(1500);
    },

    async submitApplication() {
      try {
        await Utils.waitForElement(".jobs-easy-apply-modal", 3000);

        const modal = document.querySelector(".jobs-easy-apply-modal");
        if (!modal) throw new Error("Easy Apply modal not found");

        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          if (state.shouldStop) throw new Error("Stopped by user");

          const nextButton = modal.querySelector('button[aria-label*="next"], button[aria-label*="Next"]');
          const submitButton = modal.querySelector('button[aria-label*="submit"], button[aria-label*="Submit"]');
          const reviewButton = modal.querySelector('button[aria-label*="review"], button[aria-label*="Review"]');

          if (submitButton && !submitButton.disabled) {
            submitButton.click();
            await Utils.sleep(2000);

            const successMessage = document.querySelector(".jobs-easy-apply-modal .artdeco-inline-feedback--success");
            if (successMessage) return true;

            const errorMessage = document.querySelector(".jobs-easy-apply-modal .artdeco-inline-feedback--error");
            if (errorMessage) throw new Error("Application submission failed");

            break;
          } else if (reviewButton && !reviewButton.disabled) {
            reviewButton.click();
            await Utils.sleep(1500);
          } else if (nextButton && !nextButton.disabled) {
            nextButton.click();
            await Utils.sleep(1500);
          } else {
            const requiredFields = modal.querySelectorAll("[required]:not([disabled])");
            if (requiredFields.length > 0) {
              throw new Error("Required fields need to be filled");
            }
            break;
          }

          attempts++;
        }

        return false;
      } catch (error) {
        const closeButton = document.querySelector(".jobs-easy-apply-modal .artdeco-modal__dismiss");
        if (closeButton) closeButton.click();
        throw error;
      }
    },

    getJobTitle() {
      const titleElement = document.querySelector(
        ".jobs-unified-top-card__job-title, .job-details-jobs-unified-top-card__job-title",
      );
      return titleElement ? titleElement.textContent.trim() : "Unknown Job";
    },

    getCompanyName() {
      const companyElement = document.querySelector(
        ".jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__company-name",
      );
      return companyElement ? companyElement.textContent.trim() : "Unknown Company";
    },
  };

  const Bot = {
    async processJob(jobCard, index) {
      if (state.shouldStop) return;

      const jobTitle = LinkedIn.getJobTitle();
      const companyName = LinkedIn.getCompanyName();

      UI.updateStatus(`Processing: ${jobTitle} at ${companyName}`, (index / state.totalJobs) * 100);

      try {
        await LinkedIn.clickJobCard(jobCard);

        const hasEasyApply = await LinkedIn.hasEasyApply();

        if (!hasEasyApply) {
          console.log(`Skipped: ${jobTitle} at ${companyName} - No Easy Apply`);
          state.skippedCount++;
          return;
        }

        await LinkedIn.clickEasyApply();
        const success = await LinkedIn.submitApplication();

        if (success) {
          console.log(`Applied: ${jobTitle} at ${companyName}`);
          state.appliedCount++;
        } else {
          console.log(`Skipped: ${jobTitle} at ${companyName} - Could not complete application`);
          state.skippedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${jobTitle} at ${companyName}:`, error.message);
        state.errorCount++;
      }

      await Utils.sleep(2000);
    },

    async run() {
      if (state.isRunning) {
        alert("LinkedIn Easy Apply bot is already running!");
        return;
      }

      if (!window.location.hostname.includes("linkedin.com")) {
        alert("Please run this bookmarklet on LinkedIn.com");
        return;
      }

      state.isRunning = true;
      state.shouldStop = false;
      state.appliedCount = 0;
      state.skippedCount = 0;
      state.errorCount = 0;

      const overlay = UI.createOverlay();

      try {
        const jobCards = LinkedIn.getJobCards();

        if (jobCards.length === 0) {
          alert("No job cards found. Make sure you are on a LinkedIn job search results page.");
          return;
        }

        state.totalJobs = jobCards.length;
        UI.updateStatus(`Found ${jobCards.length} jobs. Starting applications...`, 0);

        for (let i = 0; i < jobCards.length; i++) {
          if (state.shouldStop) break;
          await Bot.processJob(jobCards[i], i + 1);
        }

        UI.updateStatus("Complete!", 100);
        await Utils.sleep(1000);
      } catch (error) {
        console.error("Bot error:", error);
        alert(`An error occurred: ${error.message}`);
      } finally {
        state.isRunning = false;
        UI.removeOverlay();
        UI.showSummary();
      }
    },
  };

  Bot.run();
})();
