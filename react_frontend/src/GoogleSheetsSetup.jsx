import React, { useState } from 'react';
import { getSetupInstructions } from './googleSheetsService.js';

const GoogleSheetsSetup = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = getSetupInstructions();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Google Sheets Integration Setup</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            To enable direct order submission to Google Sheets, you need to set up a Google Apps Script web app.
            This will allow orders to be automatically added to monthly sheets without storing data in your database.
          </p>
          
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {showInstructions ? 'Hide' : 'Show'} Setup Instructions
          </button>
        </div>

        {showInstructions && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Step-by-Step Setup:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="mb-2">{step}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Google Apps Script Code:</h3>
              <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {instructions.googleAppsScriptCode}
                </pre>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Copy this code and paste it into your Google Apps Script project.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-yellow-700 space-y-1">
                <li>• Make sure to deploy the script as a web app with "Anyone" access</li>
                <li>• The Google Sheet will automatically create new monthly sheets (e.g., "2024-01", "2024-02")</li>
                <li>• Each order will include timestamp, email, phone, order summary, and total amount</li>
                <li>• Update the configuration in <code className="bg-yellow-100 px-1 rounded">googleSheetsService.js</code> with your URLs</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Benefits of This Approach:</h4>
              <ul className="text-green-700 space-y-1">
                <li>• No database storage required</li>
                <li>• Real-time order tracking in Google Sheets</li>
                <li>• Automatic monthly organization</li>
                <li>• Easy to share and collaborate on order data</li>
                <li>• Built-in Google Sheets features (filtering, charts, etc.)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleSheetsSetup;
