// api/env.js - Vercel Serverless Function to expose environment variables
// This function securely exposes only public environment variables to the frontend

export default function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Expose only public environment variables
    // These are safe to expose to the frontend
    const envVars = {
      // EmailJS Configuration
      emailjs: {
        publicKey: process.env.EMAILJS_PUBLIC_KEY || "",
        serviceId: process.env.EMAILJS_SERVICE_ID || "",
        templateId: process.env.EMAILJS_TEMPLATE_ID || "",
        adminTemplateId: process.env.EMAILJS_ADMIN_TEMPLATE_ID || "",
      },

      // WhatsApp Configuration
      whatsapp: {
        number: process.env.WHATSAPP_NUMBER || "",
        formattedNumber: process.env.WHATSAPP_NUMBER_FORMATTED || "",
        landlineNumber: process.env.LANDLINE_NUMBER || "",
      },

      // Business Information
      business: {
        name: process.env.BUSINESS_NAME || "Anas Plastic Enterprises",
        email: process.env.BUSINESS_EMAIL || "",
        facebookUrl: process.env.FACEBOOK_URL || "",
        address: process.env.BUSINESS_ADDRESS || "",
      },

      // Developer Information
      developer: {
        name: process.env.DEVELOPER_NAME || "",
        url: process.env.DEVELOPER_URL || "",
      },

      // Theme Configuration
      theme: {
        primaryColor: process.env.PRIMARY_COLOR || "#1E3A8A",
        secondaryColor: process.env.SECONDARY_COLOR || "#DC2626",
        backgroundColor: process.env.BACKGROUND_COLOR || "#FFFFFF",
      },

      // Site Configuration
      site: {
        url: process.env.SITE_URL || "",
        name: process.env.SITE_NAME || "Anas Plastic Enterprises",
      },
    };

    // Check if required variables are set
    const missingVars = [];

    if (!envVars.emailjs.publicKey) missingVars.push("EMAILJS_PUBLIC_KEY");
    if (!envVars.emailjs.serviceId) missingVars.push("EMAILJS_SERVICE_ID");
    if (!envVars.emailjs.templateId) missingVars.push("EMAILJS_TEMPLATE_ID");
    if (!envVars.whatsapp.number) missingVars.push("WHATSAPP_NUMBER");
    if (!envVars.business.email) missingVars.push("BUSINESS_EMAIL");

    if (missingVars.length > 0) {
      console.warn("Missing environment variables:", missingVars.join(", "));
    }

    // Return environment variables
    res.status(200).json({
      success: true,
      data: envVars,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error loading environment variables:", error);

    // Return fallback data in case of error
    res.status(200).json({
      success: false,
      error: "Failed to load environment variables",
      data: {
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
          address: "",
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
          url: "",
          name: "Anas Plastic Enterprises",
        },
      },
    });
  }
}
