module.exports = async ({ inputText }) => {
  const title = extractFeatureTitle(inputText);

  return `
📌 **Feature:** ${title}

\`\`\`gherkin
Feature: ${title}

  Scenario: User opens the ${title} page
    Given I am a logged-in user
    When I navigate to the "${title}" screen
    Then I should see all the key interface components

  Scenario: User interacts with ${title}
    Given I see the ${title} interface
    When I perform the main action
    Then I should receive a success message
\`\`\`

Let me know if you want to add negative test cases, edge cases, or component breakdowns!
`;
};

// Helper to extract a feature title from input
function extractFeatureTitle(text) {
  const figmaMatch = text.match(/file\/([^/?]+)/i);
  if (figmaMatch) return decodeURIComponent(figmaMatch[1]).replace(/-/g, ' ');
  return text || "Unnamed Feature";
}
