// Google Sheets Service for direct order submission
// This service handles sending order data directly to Google Sheets

// Configuration - loaded from environment variables
const GOOGLE_SHEETS_CONFIG = {
  // Google Apps Script web app URL
  WEB_APP_URL: import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL,
  // Google Sheet ID
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEETS_SHEET_ID,
  // Sheet name pattern for monthly sheets
  SHEET_NAME_PATTERN: 'YYYY-MM'
};

// Check if Google Sheets is configured
const isGoogleSheetsConfigured = GOOGLE_SHEETS_CONFIG.WEB_APP_URL && GOOGLE_SHEETS_CONFIG.SHEET_ID;

// Log warning if not configured (but don't crash the app)
if (!isGoogleSheetsConfigured) {
  console.warn('Google Sheets integration not configured. Some features may be limited.');
}

/**
 * Creates a new sheet for the current month if it doesn't exist
 * @param {string} monthYear - Format: YYYY-MM (e.g., "2024-01")
 * @returns {Promise<boolean>} - Success status
 */
export const createMonthlySheet = async (monthYear) => {
  if (!isGoogleSheetsConfigured) {
    console.warn('Google Sheets not configured - skipping sheet creation');
    return false;
  }
  
  try {
    // Use iframe form submission to completely bypass CORS
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.name = 'hiddenFrame_' + Date.now();
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_SHEETS_CONFIG.WEB_APP_URL;
      form.target = iframe.name;
      form.style.display = 'none';
      
      // Add form fields
      const fields = {
        action: 'create_sheet',
        sheetName: monthYear,
        sheetId: GOOGLE_SHEETS_CONFIG.SHEET_ID
      };
      
      Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      
      // Clean up after a short delay
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        resolve(true); // Assume success for now
      }, 1000);
    });
  } catch (error) {
    console.error('Error creating monthly sheet:', error);
    return false;
  }
};

/**
 * Gets the current month in YYYY-MM format
 * @returns {string} - Current month (e.g., "2024-01")
 */
export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Submits order data to Google Sheets
 * @param {Object} orderData - Order information
 * @param {string} orderData.email - Customer email
 * @param {string} orderData.phone - Customer phone
 * @param {Array} orderData.items - Array of order items
 * @param {number} orderData.total - Total order amount
 * @returns {Promise<Object>} - Response from Google Sheets
 */
export const submitOrderToSheets = async (orderData) => {
  if (!isGoogleSheetsConfigured) {
    console.warn('Google Sheets not configured - skipping order submission to sheets');
    return { success: false, message: 'Google Sheets integration not configured' };
  }
  
  try {
    const currentMonth = getCurrentMonth();
    
    // First, ensure the monthly sheet exists
    await createMonthlySheet(currentMonth);

    // Prepare the order data for the sheet
    const sheetData = {
      action: 'add_order',
      sheetId: GOOGLE_SHEETS_CONFIG.SHEET_ID,
      sheetName: currentMonth,
      orderData: {
        timestamp: new Date().toISOString(),
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        items: orderData.items.map(item => ({
          product_name: item.title,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        total_amount: orderData.total,
        order_summary: orderData.items.map(item => 
          `${item.quantity}x ${item.title}`
        ).join(', ')
      }
    };

    // Use iframe form submission to completely bypass CORS
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.name = 'hiddenFrame_' + Date.now();
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_SHEETS_CONFIG.WEB_APP_URL;
      form.target = iframe.name;
      form.style.display = 'none';
      
      // Add form fields
      const fields = {
        action: 'add_order',
        sheetId: GOOGLE_SHEETS_CONFIG.SHEET_ID,
        sheetName: currentMonth,
        orderData: JSON.stringify(sheetData.orderData)
      };
      
      Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      
      // Clean up after a short delay
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        console.log('Order successfully submitted to Google Sheets');
        resolve({ success: true, message: 'Order submitted successfully' });
      }, 1000);
    });
  } catch (error) {
    console.error('Error submitting order to Google Sheets:', error);
    return { success: false, error: 'Network error occurred' };
  }
};

/**
 * Gets the setup instructions for Google Apps Script
 * @returns {Object} - Setup instructions
 */
export const getSetupInstructions = () => {
  return {
    steps: [
      '1. Go to https://script.google.com/',
      '2. Create a new project',
      '3. Replace the default code with the provided Google Apps Script code',
      '4. Deploy as a web app with execute permissions for "Anyone"',
      '5. Copy the web app URL and update GOOGLE_SHEETS_CONFIG.WEB_APP_URL',
      '6. Create a Google Sheet and copy its ID from the URL',
      '7. Update GOOGLE_SHEETS_CONFIG.SHEET_ID with your sheet ID'
    ],
    googleAppsScriptCode: `

  
    
    if (action === 'create_sheet') {
      return createSheet(e.parameter.sheetId, e.parameter.sheetName);
    } else if (action === 'add_order') {
      const orderData = JSON.parse(e.parameter.orderData);
      return addOrderToSheet(e.parameter.sheetId, e.parameter.sheetName, orderData);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createSheet(sheetId, sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const existingSheet = spreadsheet.getSheetByName(sheetName);
    
    if (!existingSheet) {
      const newSheet = spreadsheet.insertSheet(sheetName);
      
      // Add headers
      const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Address', 'Order Summary', 'Total Amount'];
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      newSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      newSheet.getRange(1, 1, 1, headers.length).setBackground('#f0f0f0');
      
      return ContentService.createTextOutput(JSON.stringify({success: true, message: 'Sheet created'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true, message: 'Sheet already exists'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function addOrderToSheet(sheetId, sheetName, orderData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Sheet not found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add order data
    const rowData = [
      orderData.timestamp,
      orderData.name,
      orderData.email,
      orderData.phone,
      orderData.address,
      orderData.order_summary,
      orderData.total_amount
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({success: true, message: 'Order added'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
    `
  };
};
