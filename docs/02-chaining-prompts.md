# Chaining Prompts — Link AI Answers Together

**Asdale Dynamics, LLC** — beginner-friendly AI education, books, and tools.
Plain English, step by step. Local first. No API keys required.

---

## What is prompt chaining?

A single AI prompt usually gives one answer. Prompt chaining means taking that
answer and feeding it into a second prompt, then taking that answer and feeding
it into a third, and so on. Each step has one job. Together they do bigger
work.

Think of it like an assembly line where each station does one thing well.

---

## Why chain prompts instead of one big prompt?

| One big prompt | Chained prompts |
|----------------|-----------------|
| AI can skip steps or miss details | Each step has a clear, small job |
| Hard to tell where it went wrong | You can check each step before moving on |
| Changing one part means rewriting everything | You can fix one step and keep the rest |
| Good for quick, simple tasks | Good for writing, research, and planning |

---

## Step 1: Break your task into steps

Pick a task and split it into 2–4 steps. Each step gets its own prompt.

Example: writing a newsletter about a local event.

1. **Summarize** the event details into key points.
2. **Draft** a friendly newsletter from those points.
3. **Rewrite** the subject line to be more catchy.
4. **Check** the draft for mistakes or missing info.

Do not try to do all four in one prompt. Give each step its own turn.

---

## Step 2: Write the first prompt

Make it specific. Include the input and ask for one clear output.

**Example prompt 1:**
```
Here are rough notes from the community garden fair on October 12:

[PASTE YOUR NOTES HERE]

Turn these into 5 short bullet points. Keep the tone friendly and plain.
Save any dates, times, and locations exactly as written.
```

Run it. Copy the output. That is the output of step 1.

---

## Step 3: Feed the output into the next prompt

Take what step 1 gave you and paste it into step 2's prompt. Mark clearly what
is new input and what is instructions.

**Example prompt 2:**
```
Using these bullet points from the community garden fair:

[PASTE STEP 1 OUTPUT HERE]

Write a 200-word newsletter in a warm, neighborly tone. Include a short
introduction, the 5 bullet points, and one sentence inviting people to the
next fair.
```

Run it. Copy the output. That is the output of step 2.

---

## Step 4: Repeat for each step

**Example prompt 3 (subject lines):**
```
Here is the newsletter draft:

[PASTE STEP 2 OUTPUT HERE]

Write 3 subject lines. One warm, one curious, one short. Label each one.
```

**Example prompt 4 (final check):**
```
Here is the full newsletter draft and the chosen subject line:

[PASTE STEP 2 AND STEP 3 OUTPUT HERE]

Check for: spelling mistakes, missing dates or locations, anything unclear,
and anything that sounds like medical advice. List problems only. Do not
rewrite yet.
```

Fix anything the check finds, then you are done.

---

## Step 5: Save the chain

Save your prompts somewhere you can reuse them — a notes app, a text file, or
the planner worksheet in this guide. Next time you write a newsletter, you
only need to paste in new notes. The chain stays the same.

---

## Tips for better chains

- **One job per step.** If a step feels too long, split it into two.
- **Name your variables.** Use labels like `[STEP 1 OUTPUT]` so you never
  paste the wrong thing into the wrong prompt.
- **Check before continuing.** Read each output before you feed it forward.
  Garbage in, garbage out.
- **Keep humans in the loop.** See Chapter 3 for when and how to review.
- **Start small.** Two steps is plenty for your first chain.

---

## A printable mini-template

Copy this into your notes and fill it in:

```
Task: ___________________________________________________

Step 1: ___________________________________________________
Prompt: ___________________________________________________
Input: ____________________________________________________
Expected output: __________________________________________

Step 2: ___________________________________________________
Prompt: ___________________________________________________
Input: (output from Step 1)
Expected output: __________________________________________

Human check after Step ___: ________________________________
```

---

## Next step

Chains work best when a person checks the work between steps. Chapter 3
explains how to keep humans in the loop without slowing yourself down.

---

*Written and published by Asdale Dynamics, LLC (Dylan Asdale). Indiana, formed
October 2026. Education only — never medical advice.*
