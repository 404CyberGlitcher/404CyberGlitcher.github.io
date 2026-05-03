// Admin Contacts Management
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { CONTACTS_CONFIG } from "../config/firebase.js";
import { showToast } from "../components/cart.js";
import { sendContactAutoReply } from "../utils/emailjs.js";

// Initialize Firebase
const contactsApp = initializeApp(CONTACTS_CONFIG, "contacts");
const contactsDb = getFirestore(contactsApp);

// State
let allContacts = [];

// Initialize contacts management
export async function initContactsManagement() {
  await loadContacts();
  initEventListeners();
}

// Load contacts from Firebase
async function loadContacts() {
  const tableBody = document.getElementById("contactsTableBody");
  if (!tableBody) return;

  try {
    const contactsRef = collection(contactsDb, "contacts");
    const q = query(contactsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    allContacts = [];
    querySnapshot.forEach((doc) => {
      allContacts.push({ id: doc.id, ...doc.data() });
    });

    renderContactsTable();
    updateStats();
  } catch (error) {
    console.error("Error loading contacts:", error);
    tableBody.innerHTML =
      '<tr><td colspan="6">Error loading contacts</td></tr>';
  }
}

// Update statistics
function updateStats() {
  const statsContainer = document.getElementById("contactsStats");
  if (!statsContainer) return;

  const unread = allContacts.filter((c) => c.status === "unread").length;
  const read = allContacts.filter((c) => c.status === "read").length;
  const thisMonth = allContacts.filter((c) => {
    if (!c.createdAt) return false;
    const date = c.createdAt.toDate
      ? c.createdAt.toDate()
      : new Date(c.createdAt);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${allContacts.length}</div>
            <div>Total Messages</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${unread}</div>
            <div>Unread</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${read}</div>
            <div>Read</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${thisMonth}</div>
            <div>This Month</div>
        </div>
    `;
}

// Render contacts table
function renderContactsTable() {
  const tableBody = document.getElementById("contactsTableBody");
  if (!tableBody) return;

  if (allContacts.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">No messages found</td></tr>';
    return;
  }

  tableBody.innerHTML = allContacts
    .map((contact) => {
      const date = contact.createdAt?.toDate
        ? contact.createdAt.toDate()
        : new Date(contact.createdAt);
      return `
            <tr data-contact-id="${contact.id}">
                <td>${date.toLocaleDateString()}</td>
                <td>${contact.name || "N/A"}</td>
                <td>${contact.email || "N/A"}</td>
                <td>${contact.subject || "No subject"}</td>
                <td><span class="status-badge status-${contact.status || "unread"}">${contact.status || "unread"}</span></td>
                <td><button class="view-btn" data-id="${contact.id}">View</button></td>
            </tr>
        `;
    })
    .join("");

  // Add click handlers for view buttons
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const contactId = btn.dataset.id;
      const contact = allContacts.find((c) => c.id === contactId);
      if (contact) showContactDetail(contact);
    });
  });
}

// Show contact detail modal
function showContactDetail(contact) {
  const modal = document.getElementById("contactDetailModal");
  const body = document.getElementById("contactDetailBody");

  if (!modal || !body) return;

  const date = contact.createdAt?.toDate
    ? contact.createdAt.toDate()
    : new Date(contact.createdAt);

  body.innerHTML = `
        <div class="contact-info">
            <div class="contact-field">
                <label>Name:</label>
                <div class="field-value">${contact.name || "N/A"}</div>
            </div>
            <div class="contact-field">
                <label>Email:</label>
                <div class="field-value"><a href="mailto:${contact.email}">${contact.email}</a></div>
            </div>
            ${
              contact.phone
                ? `
                <div class="contact-field">
                    <label>Phone:</label>
                    <div class="field-value">${contact.phone}</div>
                </div>
            `
                : ""
            }
            <div class="contact-field">
                <label>Subject:</label>
                <div class="field-value">${contact.subject || "No subject"}</div>
            </div>
            <div class="contact-field">
                <label>Date:</label>
                <div class="field-value">${date.toLocaleString()}</div>
            </div>
            <div class="contact-field">
                <label>Message:</label>
                <div class="contact-message">${contact.message || "No message content"}</div>
            </div>
        </div>
        <div class="reply-section">
            <h4>Reply to Customer</h4>
            <textarea class="reply-textarea" id="replyMessage" placeholder="Type your reply here..."></textarea>
            <button class="send-reply-btn" data-id="${contact.id}" data-email="${contact.email}" data-name="${contact.name}">Send Reply</button>
            <button class="mark-read-btn" data-id="${contact.id}">Mark as Read</button>
        </div>
    `;

  modal.classList.add("active");

  // Send reply button
  const sendReplyBtn = body.querySelector(".send-reply-btn");
  if (sendReplyBtn) {
    sendReplyBtn.addEventListener("click", async () => {
      const replyMessage = document.getElementById("replyMessage")?.value;
      if (!replyMessage) {
        showToast("Please enter a reply message", "error");
        return;
      }

      await sendReply(
        sendReplyBtn.dataset.email,
        sendReplyBtn.dataset.name,
        contact.subject,
        replyMessage,
      );

      // Mark as read after replying
      await markAsRead(sendReplyBtn.dataset.id);
      modal.classList.remove("active");
    });
  }

  // Mark as read button
  const markReadBtn = body.querySelector(".mark-read-btn");
  if (markReadBtn) {
    markReadBtn.addEventListener("click", async () => {
      await markAsRead(markReadBtn.dataset.id);
      modal.classList.remove("active");
    });
  }

  // Auto-mark as read when opened
  if (contact.status !== "read") {
    markAsRead(contact.id);
  }
}

// Send reply to customer
async function sendReply(email, name, subject, message) {
  try {
    // Use EmailJS to send reply
    const { sendContactAutoReply } = await import("../utils/emailjs.js");

    await sendContactAutoReply({
      email: email,
      name: name,
      subject: `Re: ${subject}`,
      message: message,
    });

    showToast(`Reply sent to ${email}`);
  } catch (error) {
    console.error("Error sending reply:", error);
    showToast("Failed to send reply", "error");
  }
}

// Mark contact as read
async function markAsRead(contactId) {
  try {
    const contactRef = doc(contactsDb, "contacts", contactId);
    await updateDoc(contactRef, { status: "read" });

    // Update local state
    const contact = allContacts.find((c) => c.id === contactId);
    if (contact) contact.status = "read";

    renderContactsTable();
    updateStats();

    showToast("Message marked as read");
  } catch (error) {
    console.error("Error marking as read:", error);
  }
}

// Initialize event listeners for filters
function initEventListeners() {
  // Status filter
  const statusFilter = document.getElementById("filterContactStatus");
  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      const status = e.target.value;
      if (status === "all") {
        renderContactsTable();
      } else {
        const filtered = allContacts.filter((c) => c.status === status);
        const tableBody = document.getElementById("contactsTableBody");
        if (tableBody) {
          if (filtered.length === 0) {
            tableBody.innerHTML =
              '<tr><td colspan="6">No messages found</td></tr>';
          } else {
            renderFilteredContacts(filtered);
          }
        }
      }
    });
  }

  // Date filter
  const dateFilter = document.getElementById("filterContactDate");
  if (dateFilter) {
    dateFilter.addEventListener("change", (e) => {
      const filterDate = new Date(e.target.value);
      if (filterDate && e.target.value) {
        const filtered = allContacts.filter((c) => {
          if (!c.createdAt) return false;
          const date = c.createdAt.toDate
            ? c.createdAt.toDate()
            : new Date(c.createdAt);
          return date.toDateString() === filterDate.toDateString();
        });
        renderFilteredContacts(filtered);
      } else {
        renderContactsTable();
      }
    });
  }

  // Modal close
  const closeBtns = document.querySelectorAll(".close-modal");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("contactDetailModal")?.classList.remove("active");
    });
  });
}

// Render filtered contacts
function renderFilteredContacts(contacts) {
  const tableBody = document.getElementById("contactsTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = contacts
    .map((contact) => {
      const date = contact.createdAt?.toDate
        ? contact.createdAt.toDate()
        : new Date(contact.createdAt);
      return `
            <tr data-contact-id="${contact.id}">
                <td>${date.toLocaleDateString()}</td>
                <td>${contact.name || "N/A"}</td>
                <td>${contact.email || "N/A"}</td>
                <td>${contact.subject || "No subject"}</td>
                <td><span class="status-badge status-${contact.status || "unread"}">${contact.status || "unread"}</span></td>
                <td><button class="view-btn" data-id="${contact.id}">View</button></td>
            </tr>
        `;
    })
    .join("");

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const contactId = btn.dataset.id;
      const contact = contacts.find((c) => c.id === contactId);
      if (contact) showContactDetail(contact);
    });
  });
}
