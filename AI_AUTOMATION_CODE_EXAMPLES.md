# AI Automation - Code Examples & Troubleshooting

## 📝 Code Examples

### Using the AI Modal in Your App

#### Example 1: Basic Implementation (Already Done)
```jsx
import AIProjectAutomationModal from "./modals/AIProjectAutomationModal";

export default function ProjectPage() {
  const [showAIModal, setShowAIModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowAIModal(true)}>
        🤖 AI Generate
      </button>

      {showAIModal && (
        <AIProjectAutomationModal
          onClose={() => setShowAIModal(false)}
        />
      )}
    </>
  );
}
```

#### Example 2: Calling API Directly
```jsx
import ApiServices from "./ApiService/ApiService";

// Generate project breakdown
const generateProject = async () => {
  try {
    const result = await ApiServices.generateProjectBreakdown({
      projectDescription: "Build a task management app",
      startDate: "2024-01-01",
      endDate: "2024-03-31"
    });
    console.log("Generated project:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Generate tasks for existing project
const generateTasks = async () => {
  try {
    const result = await ApiServices.generateTasksForProject({
      projectId: "123456789",
      taskDescription: "API development, database setup",
      numberOfTasks: 5
    });
    console.log("Generated tasks:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
```

#### Example 3: With Redux Dispatch
```jsx
import { useDispatch } from "react-redux";
import { FetchAllProjects } from "../Slices/ProjectSlice";

const handleSuccess = async () => {
  // Refresh projects list
  dispatch(FetchAllProjects());
  
  // Show success message (optional)
  const notification = {
    type: "success",
    message: "Project created successfully!"
  };
  // Dispatch to your notification state
};
```

---

## 🧪 Testing Examples

### Test Case 1: Create Project Successfully
```javascript
describe("AIProjectAutomationModal", () => {
  it("should generate project breakdown successfully", async () => {
    const mockData = {
      success: true,
      data: {
        projectName: "Test Project",
        projectDescription: "Test Description",
        budget: 5000,
        tasks: [
          {
            title: "Task 1",
            description: "Test task",
            priority: "High",
            estimatedHours: 40,
            subtasks: []
          }
        ]
      },
      errors: []
    };

    // Mock API
    jest.mock("../ApiService/ApiService", () => ({
      generateProjectBreakdown: jest.fn(() => Promise.resolve(mockData))
    }));

    // Test component
    const { getByText, getByDisplayValue } = render(
      <AIProjectAutomationModal onClose={jest.fn()} />
    );

    // Fill form
    fireEvent.change(getByDisplayValue(""), {
      target: { value: "Create a website" }
    });
    fireEvent.click(getByText("Next"));

    // Wait for generation
    await waitFor(() => {
      expect(getByText("Test Project")).toBeInTheDocument();
    });
  });
});
```

### Test Case 2: Validation
```javascript
it("should show error for empty description", async () => {
  const { getByText, getByRole } = render(
    <AIProjectAutomationModal onClose={jest.fn()} />
  );

  // Try to proceed without description
  fireEvent.click(getByText("Next"));

  // Should show error
  await waitFor(() => {
    expect(getByText(/describe your project/i)).toBeInTheDocument();
  });
});
```

### Test Case 3: Date Validation
```javascript
it("should reject end date before start date", async () => {
  const { getByText, getByDisplayValue } = render(
    <AIProjectAutomationModal onClose={jest.fn()} />
  );

  const dateInputs = getByRole("textbox");
  fireEvent.change(dateInputs[1], { target: { value: "2024-01-01" } });
  fireEvent.change(dateInputs[2], { target: { value: "2023-12-01" } });

  fireEvent.click(getByText("Next"));

  await waitFor(() => {
    expect(getByText(/end date must be after/i)).toBeInTheDocument();
  });
});
```

---

## 🐛 Troubleshooting Guide

### Issue 1: Button Not Appearing

**Symptoms:**
- 🤖 AI Generate button not visible
- Only "New Project" button shows

**Possible Causes:**
```jsx
// ❌ WRONG: Button only shows if projects.length > 0
{role === 'manager' && projects.length > 0 && (
  <button>🤖 AI Generate</button>
)}

// ✅ CORRECT: Show always if manager
{role === 'manager' && (
  <button>🤖 AI Generate</button>
)}
```

**Fixes:**
1. Check if user is logged in as manager
2. Verify `role === 'manager'` in Redux state
3. Check component imports
4. Clear browser cache and reload
5. Check browser console for errors

**Debug Steps:**
```jsx
// Add to projectPage/page.jsx to debug
console.log("User role:", user?.role);
console.log("Is manager:", role === 'manager');
console.log("Projects count:", projects?.length);
```

---

### Issue 2: Modal Won't Open

**Symptoms:**
- Clicking button does nothing
- No modal appears

**Possible Causes:**
```jsx
// ❌ WRONG: Import not included
// import AIProjectAutomationModal from ... (missing)

// ✅ CORRECT: Import statement present
import AIProjectAutomationModal from "../../modals/AIProjectAutomationModal";

// ❌ WRONG: showAIModal state not initialized
const [showAIModal, setShowAIModal] = useState(false); // Missing

// ✅ CORRECT: State initialized
const [showAIModal, setShowAIModal] = useState(false);
```

**Fixes:**
1. Verify import statement exists
2. Check state initialization
3. Check onClick handler assigns correct state
4. Look for syntax errors in JSX

**Debug Steps:**
```jsx
// Add console logs to track state
const handleAIClick = () => {
  console.log("Before:", showAIModal);
  setShowAIModal(true);
  console.log("After:", showAIModal);
};
```

---

### Issue 3: API Call Fails

**Symptoms:**
- Click "Next" → nothing happens
- "Generating..." state lasts forever
- Error message appears

**Possible Causes:**
```javascript
// ❌ WRONG: Backend endpoint not running
// POST /api/ai/generate-project-breakdown → 404

// ❌ WRONG: Gemini API key missing
process.env.GEMINI_API_KEY = "" // Empty

// ❌ WRONG: Invalid request format
{
  projectDescription: "", // ❌ Empty
  startDate: "2024-01-01"
}

// ✅ CORRECT: Valid request
{
  projectDescription: "Build a website", // ✓ Not empty
  startDate: "2024-01-01",
  endDate: "2024-03-31"
}
```

**Fixes:**
1. Verify backend server is running: `npm start` in backend folder
2. Check Gemini API key in `.env`
3. Verify all required fields are filled
4. Check network tab in DevTools (F12)
5. Look at backend console for detailed errors

**Debug Steps:**
```javascript
// Check network request in DevTools
// 1. Open DevTools (F12)
// 2. Go to Network tab
// 3. Click "Next" button
// 4. Look for POST /api/ai/generate-project-breakdown
// 5. Check Response and Status Code

// Common Status Codes:
// 200 - Success
// 400 - Bad request (validation failed)
// 401 - Unauthorized (token invalid)
// 403 - Forbidden (not manager)
// 404 - Endpoint not found
// 500 - Server error
```

---

### Issue 4: Generated Data Doesn't Show

**Symptoms:**
- "Next" button works
- But no data appears in Step 2
- Or shows wrong data

**Possible Causes:**
```javascript
// ❌ WRONG: API response format incorrect
response = {
  data: null,
  errors: ["Generation failed"]
}

// ✅ CORRECT: Expected format
response = {
  success: true,
  data: {
    projectName: "...",
    tasks: [...]
  },
  errors: []
}

// ❌ WRONG: JSON parsing fails
const jsonText = responseText; // Not parsed
const result = JSON.parse(jsonText); // Fails if not JSON

// ✅ CORRECT: Handle markdown wrapper
let jsonText = responseText;
if (jsonText.includes("```json")) {
  jsonText = jsonText.split("```json")[1].split("```")[0];
}
const result = JSON.parse(jsonText.trim());
```

**Fixes:**
1. Verify API response format matches expected structure
2. Check backend returns proper JSON
3. Check generatedData state in React DevTools
4. Verify no parsing errors in console
5. Check browser DevTools → Console for errors

**Debug Steps:**
```javascript
// Add logging to AIProjectAutomationModal.jsx
handleGenerateProjectBreakdown = async () => {
  try {
    const data = await ApiServices.generateProjectBreakdown({...});
    console.log("Raw response:", data); // Log raw response
    console.log("Has success:", data.success);
    console.log("Has data:", data.data);
    console.log("Data structure:", data.data?.tasks?.length);
    setGeneratedData(data); // Should work if structure is correct
  } catch (err) {
    console.error("Generation error:", err);
  }
};
```

---

### Issue 5: Validation Errors

**Symptoms:**
- "Please describe your project" error
- "Please select project" error
- "Invalid date range" error

**Possible Causes & Fixes:**

```javascript
// ERROR: "Please describe your project"
// CAUSE: projectDescription is empty or whitespace
// FIX: Enter actual description in textarea

// ERROR: "Please select project" (for Add Tasks mode)
// CAUSE: projectId not selected or empty
// FIX: Choose a project from dropdown first

// ERROR: "End date must be after start date"
// CAUSE: Selected end date is before start date
// FIX: Ensure end date is after start date

// ERROR: "Number of tasks should be between 1 and 10"
// CAUSE: Entered number outside valid range
// FIX: Choose number between 1 and 10

// ERROR: "Invalid project ID"
// CAUSE: Wrong projectId format
// FIX: Verify project is properly selected
```

**Debug Steps:**
```javascript
// Check form values in React DevTools
// 1. Open React DevTools
// 2. Find AIProjectAutomationModal component
// 3. Check "form" state object
// 4. Verify all required fields are non-empty
```

---

### Issue 6: Modal Won't Close

**Symptoms:**
- Close button doesn't work
- Modal stays open after generation
- Clicking backdrop doesn't close

**Possible Causes:**
```jsx
// ❌ WRONG: Modal still loading, close button disabled
{isLoading && (
  <button disabled onClick={onClose}>Close</button>
)}

// ✅ CORRECT: Button enabled when not loading
<button disabled={isLoading} onClick={onClose}>Close</button>

// ❌ WRONG: onClose callback not passed
<AIProjectAutomationModal /> // Missing onClose

// ✅ CORRECT: onClose callback provided
<AIProjectAutomationModal onClose={() => setShowAIModal(false)} />
```

**Fixes:**
1. Wait for API call to complete (watch loading indicator)
2. Verify onClose callback is passed to modal
3. Check for JavaScript errors in console
4. Try closing with Escape key
5. Hard refresh browser (Ctrl+F5)

**Debug Steps:**
```jsx
// Check if onClose is being called
const handleOnClose = () => {
  console.log("onClose called!");
  setShowAIModal(false);
};

<AIProjectAutomationModal onClose={handleOnClose} />
```

---

### Issue 7: Redux Not Updating

**Symptoms:**
- Generation succeeds
- Modal closes
- Projects list doesn't refresh
- New project not visible

**Possible Causes:**
```javascript
// ❌ WRONG: Dispatch missing
// (no FetchAllProjects after success)
handleConfirmGeneration = async () => {
  setIsLoading(false);
  onClose(); // Redux not updated
};

// ✅ CORRECT: Dispatch refresh
handleConfirmGeneration = async () => {
  dispatch(FetchAllProjects()); // Refresh projects
  onClose();
};

// ❌ WRONG: Redux action not exported
// export { FetchAllProjects }; // Missing

// ✅ CORRECT: Action exported
export const FetchAllProjects = (state) => { ... };
```

**Fixes:**
1. Check dispatch(FetchAllProjects()) is called
2. Verify action is exported from Redux slice
3. Check Redux DevTools to see state changes
4. Manually refresh page to verify project exists
5. Check backend logs to confirm project was created

**Debug Steps:**
```jsx
// Add logging to track Redux updates
const handleConfirmGeneration = async () => {
  console.log("Before dispatch");
  dispatch(FetchAllProjects());
  console.log("After dispatch");
  
  // Check state after delay
  setTimeout(() => {
    console.log("Projects:", projects);
  }, 1000);
};
```

---

## 🔍 Console Check Commands

```javascript
// In browser console (F12 → Console tab):

// Check if modal component exists
console.log(document.querySelector('[class*="fadeIn"]'));

// Check user role
console.log(localStorage.getItem('user')); // Look for role

// Check API response
// (Open Network tab first, then generate)
// Click on generate-project-breakdown request
// Look at Response tab

// Check Redux state
// (With Redux DevTools installed)
// Open Redux DevTools tab
// Look at state tree
// Navigate to state.Project.projects

// Check for errors
console.log(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
```

---

## 📋 Checklist for Debugging

- [ ] Is user logged in as manager?
- [ ] Is backend server running?
- [ ] Is Gemini API key set in .env?
- [ ] Are all required fields filled?
- [ ] Are dates in correct format (YYYY-MM-DD)?
- [ ] Is date range valid (end > start)?
- [ ] Check DevTools Network tab for 200 response
- [ ] Check DevTools Console for errors
- [ ] Is modal component imported correctly?
- [ ] Is onClose callback provided?
- [ ] Is Redux dispatch working?
- [ ] Are projects refreshing in list?
- [ ] Clear cache and reload (Ctrl+F5)

---

## 📞 Getting Help

If you're still stuck:

1. **Check the logs:**
   - Browser console (F12 → Console)
   - Backend console terminal
   - Network tab (F12 → Network)

2. **Check the state:**
   - Redux DevTools
   - React DevTools
   - Component props and state

3. **Verify setup:**
   - Backend running?
   - API endpoints available?
   - Authentication valid?
   - Environment variables set?

4. **Try isolation:**
   - Test API directly with Postman
   - Test form validation separately
   - Test Redux dispatch separately

5. **Review code:**
   - Check all imports
   - Verify method signatures
   - Check prop types
   - Look for typos

---

**Most issues are resolved by checking the console errors and network responses!**
