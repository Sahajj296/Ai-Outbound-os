# 👥 User Testing Guide - Lead Generation Specialists

Guide for conducting user testing sessions with lead generation professionals.

---

## 🎯 Testing Objectives

**Primary Goals:**
- Validate the workflow matches real-world lead generation processes
- Identify usability issues from domain experts
- Gather feedback on scoring accuracy and relevance
- Test with real lead data scenarios
- Discover missing features or pain points

---

## ✅ Pre-Testing Checklist

### Before Inviting Testers

- [ ] **App is fully functional** - All features work without crashes
- [ ] **Sample data ready** - Have realistic CSV files prepared
- [ ] **Test environment stable** - Dev server running smoothly
- [ ] **Clear instructions** - Testing guide prepared
- [ ] **Feedback form ready** - Way to collect structured feedback
- [ ] **Time allocated** - 30-45 minutes per tester

### What to Prepare

1. **Sample Lead Files** (2-3 different scenarios):
   - Small dataset (10-20 leads) - Quick testing
   - Medium dataset (50-100 leads) - Realistic scenario
   - Mixed quality leads - Some with missing data

2. **Test Scenarios**:
   - Scenario A: Upload CSV and review results
   - Scenario B: Import from URL (if applicable)
   - Scenario C: Filter and export specific leads

3. **Questions to Ask**:
   - Does the scoring make sense for your workflow?
   - What information is missing?
   - What would make this more useful?
   - Any confusing parts?

---

## 📋 Testing Scenarios

### Scenario 1: Basic Lead Upload & Review (15 min)

**Instructions for Tester:**
1. Go to homepage
2. Upload a CSV file with leads
3. Review the scored results
4. Check if scores align with your expectations

**What to Observe:**
- [ ] Can they easily find the upload button?
- [ ] Do they understand the scoring explanation?
- [ ] Are the results useful/actionable?
- [ ] Any confusion about the interface?

**Questions to Ask:**
- "Does this scoring match how you'd prioritize leads?"
- "What information do you need that's missing?"
- "Is the 'Reason' column helpful?"

---

### Scenario 2: Filtering & Export (10 min)

**Instructions for Tester:**
1. Filter leads by status (Hot/Warm/Cold)
2. Sort by score
3. Export filtered results

**What to Observe:**
- [ ] Can they easily filter leads?
- [ ] Do they understand the status categories?
- [ ] Is the export process clear?
- [ ] Would they use this in their workflow?

**Questions to Ask:**
- "Would you typically filter by status or score?"
- "What other filters would be useful?"
- "Is the export format what you need?"

---

### Scenario 3: Error Handling (5 min)

**Instructions for Tester:**
1. Try uploading an invalid file
2. Try uploading without a file
3. Enter an invalid URL

**What to Observe:**
- [ ] Are error messages clear?
- [ ] Do they know how to fix errors?
- [ ] Is the recovery process obvious?

**Questions to Ask:**
- "Were the error messages helpful?"
- "Did you know what to do next?"

---

### Scenario 4: Real-World Workflow (15 min)

**Instructions for Tester:**
1. Use your own lead data (if comfortable)
2. Go through your typical workflow
3. Identify what works and what doesn't

**What to Observe:**
- [ ] Does it fit their actual process?
- [ ] What features are missing?
- [ ] What would make them use this daily?

**Questions to Ask:**
- "How does this compare to your current tools?"
- "What's the biggest pain point this solves?"
- "What's missing that would make this essential?"

---

## 📊 Feedback Collection Template

### Quick Feedback Form

```
Tester Name: ________________
Date: ________________
Role: ________________ (e.g., Sales Manager, Lead Gen Specialist)

1. Overall Experience (1-5):
   [ ] 1 - Very Poor
   [ ] 2 - Poor
   [ ] 3 - Neutral
   [ ] 4 - Good
   [ ] 5 - Excellent

2. Ease of Use (1-5):
   [ ] 1 - Very Difficult
   [ ] 5 - Very Easy

3. Scoring Accuracy:
   - Does the scoring make sense? Yes / No / Partially
   - Comments: ________________

4. Most Useful Feature:
   ________________

5. Most Confusing Part:
   ________________

6. Missing Features:
   ________________

7. Would You Use This? Yes / No / Maybe
   Why? ________________

8. Biggest Pain Point Solved:
   ________________

9. Biggest Pain Point Remaining:
   ________________

10. Additional Comments:
   ________________
```

---

## 🎤 Interview Questions (Optional Deep Dive)

### About Scoring
- "How do you currently prioritize leads?"
- "What factors matter most in lead quality?"
- "Does our scoring align with your process?"
- "What scoring factors are we missing?"

### About Workflow
- "Walk me through your current lead processing workflow"
- "Where would this tool fit in?"
- "What tools do you use now?"
- "What would make you switch?"

### About Features
- "What's the most important feature for you?"
- "What feature is missing?"
- "What would make this a daily-use tool?"
- "Any integrations you need?"

---

## 🔍 What to Watch For

### Positive Signals ✅
- Tester completes tasks without asking for help
- Tester says "This is useful" or "I'd use this"
- Tester asks "Can I use my own data?"
- Tester suggests small tweaks (not major changes)
- Tester understands scoring without explanation

### Red Flags 🚩
- Tester gets stuck and can't proceed
- Tester says "I don't understand this"
- Tester asks "Why would I use this?"
- Tester suggests major workflow changes
- Tester can't find basic features

---

## 📝 Post-Testing Actions

### Immediate (During/Right After)
- [ ] Take notes on what confused them
- [ ] Note any bugs or crashes
- [ ] Record feature requests
- [ ] Ask follow-up questions

### Short-term (Within 24 hours)
- [ ] Compile feedback from all testers
- [ ] Identify common themes
- [ ] Prioritize fixes (critical vs. nice-to-have)
- [ ] Create action items

### Before Next Round
- [ ] Fix critical issues
- [ ] Implement high-priority features
- [ ] Update based on feedback
- [ ] Prepare for round 2 testing

---

## 🎯 Success Criteria

**Testing is successful if:**
- ✅ Testers can complete core tasks without major confusion
- ✅ Scoring makes sense to domain experts
- ✅ Testers see value in the tool
- ✅ Feedback is actionable (not "everything is broken")
- ✅ You identify 3-5 key improvements

**If testers struggle:**
- Don't panic - this is valuable feedback!
- Focus on the most critical issues first
- Consider a second round of testing after fixes

---

## 💡 Tips for Conducting Tests

### Do's ✅
- **Let them explore** - Don't guide too much
- **Watch silently** - See where they struggle
- **Ask open questions** - "What do you think?" not "Do you like it?"
- **Take notes** - You'll forget details
- **Be neutral** - Don't defend, just listen
- **Test with real data** - More authentic experience

### Don'ts ❌
- **Don't help too much** - Let them figure it out
- **Don't explain features** - See if UI is self-explanatory
- **Don't take it personally** - Feedback is about the product
- **Don't rush** - Give them time to explore
- **Don't test with too many people** - 3-5 specialists is enough

---

## 📈 Testing Schedule Example

### Week 1: Preparation
- [ ] Day 1-2: Finalize app features
- [ ] Day 3: Prepare test data and scenarios
- [ ] Day 4: Create feedback forms
- [ ] Day 5: Recruit 3-5 testers

### Week 2: Testing
- [ ] Day 1-2: Conduct tests (1-2 testers per day)
- [ ] Day 3: Compile feedback
- [ ] Day 4-5: Implement critical fixes

### Week 3: Iteration
- [ ] Day 1-2: Test again with fixes
- [ ] Day 3: Final adjustments
- [ ] Day 4-5: Prepare for deployment

---

## 🚀 Ready to Test?

**Before you start:**
1. ✅ App is stable and functional
2. ✅ Sample data prepared
3. ✅ Feedback form ready
4. ✅ Testers recruited
5. ✅ Time scheduled

**Good luck! Remember: The goal is to learn, not to prove the app is perfect.**

---

## 📞 Quick Reference

**Key Questions to Always Ask:**
1. "What do you think of the scoring?"
2. "What's missing?"
3. "Would you use this?"
4. "What would make it better?"

**Red Flags to Watch:**
- Can't complete basic tasks
- Doesn't understand core features
- No clear value proposition

**Success Indicators:**
- Completes tasks independently
- Sees value in the tool
- Provides constructive feedback

