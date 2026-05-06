// js/config.js - Configuration Loader
// Loads environment variables from Vercel API

class Config {
  constructor() {
    this.config = null;
    this.loaded = false;
    this.loading = false;
    this.listeners = [];
  }

  async load() {
    if (this.loaded || this.loading) {
      return this.config;
    }

    this.loading = true;

    try {
      const response = await fetch("/api/env");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        this.config = result.data;
        this.loaded = true;
        this.loading = false;

        // Notify all listeners
        this.listeners.forEach((listener) => listener(this.config));
        this.listeners = [];

        // Store in window for global access
        window.ENV = this.config;

        console.log("✅ Configuration loaded successfully");
        return this.config;
      } else {
        throw new Error("Failed to load configuration");
      }
    } catch (error) {
      console.warn("⚠️ Failed to load configuration from API:", error.message);

      // Return empty config as fallback
      this.config = this.getFallbackConfig();
      this.loaded = true;
      this.loading = false;

      // Notify listeners with fallback config
      this.listeners.forEach((listener) => listener(this.config));
      this.listeners = [];

      window.ENV = this.config;

      return this.config;
    }
  }

  getFallbackConfig() {
    return {
      emailjs: {
        publicKey: "",
        serviceId: "",
        templateId: "",
        adminTemplateId: "",
      },
      whatsapp: {
        number: "",
        formattedNumber: "",
        landlineNumber: "",
      },
      business: {
        name: "Anas Plastic Enterprises",
        email: "",
        facebookUrl: "",
        address:
          "Shop #7, Madni Three Center, 786 Market, Paper Mandi, Shah Alam Market, Lahore",
      },
      developer: {
        name: "Asia X Network (SMC-PVT) LTD",
        url: "https://asiaxnetwork.vercel.app",
      },
      theme: {
        primaryColor: "#1E3A8A",
        secondaryColor: "#DC2626",
        backgroundColor: "#FFFFFF",
      },
      site: {
        url: "https://www.anasplastic.com",
        name: "Anas Plastic Enterprises",
      },
    };
  }

  get(key) {
    if (!this.config) return null;
    return key.split(".").reduce((obj, k) => obj?.[k], this.config);
  }

  onLoad(callback) {
    if (this.loaded) {
      callback(this.config);
    } else {
      this.listeners.push(callback);
    }
  }

  isLoaded() {
    return this.loaded;
  }
}

// Create global config instance
window.config = new Config();
