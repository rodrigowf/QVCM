# Quantum Vantage Consciousness Model (QVCM)

**QVCM** (Quantum Vantage Consciousness Model) is a theoretical framework that bridges quantum mechanics, neuroscience, and the philosophy of mind to explain consciousness and perception. This repository contains the formal documentation of the QVCM theory and two demonstration applications – a dynamic website and an interactive chat interface – to help share and explore the hypothesis.

## Project Overview

QVCM, formulated by **Rodrigo Werneck Franco**, posits that:  
- **Perception→Decision loop** – a conscious moment is a quantum state that projects the world inside (perception) and intentionally reconfigures to guide action (decision). Both steps are fundamental.  
- **Variable oneness and vantage components** – the same substrate can host multiple co-active centers of experience. An order parameter captures how unified or plural the moment feels.  
- **Mesoscale coupling tunes consciousness** – oscillations, neuromodulators, and entanglement weights adjust which vantage components dominate, enabling unity, multiplicity, conflict, or merger.  
*(These and other principles are detailed in the documentation.)*

The goal of this project is to **share and demonstrate QVCM** in an accessible way. The dynamic website provides a readable format of the hypothesis with examples, and the chat application allows users to ask questions to an AI that is knowledgeable about QVCM from different perspectives.

## Repository Contents

- **`QVCM.md`** – Main documentation of the Quantum Vantage Consciousness Model, including its axioms, mathematical formulation, and implications across ten sections. This is the core theory write-up.  
- **`chat/` directory** – Source code for the chat-based GPT application. This includes:  
  - *Prompt files* (`QVCM_Specialist_prompt.txt`, `QVCM_sage_prompt.txt`, etc.) defining AI personas.  
  - HTML/JS/CSS for the chat interface which allow users to interact with an AI about QVCM. Two modes are provided: **Specialist** (a PhD physicist/neurobiologist persona) and **Sage** (a mystic sage persona), both informed by the QVCM content.  
- **`page/` directory** – Source code for the dynamic website presenting QVCM. Contains `index.html`, styling, and scripts that render the hypothesis content in a user-friendly way with interactive elements and navigation through the sections of the hypothesis.  
- **`server.js`** – A simple Node.js server that serves the files in `page/` and `chat/`. This allows you to run the website and chat application locally for demonstration.  

## Installation and Setup

**Prerequisites:** You should have [Node.js](https://nodejs.org) installed to run the server. An internet connection is required for the chat application to contact the OpenAI API. You will also need an OpenAI API key for the chat application to function. 

**Steps:**

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/rodrigowf/QHCH.git  
   cd QHCH/chat
   ``` 

2. **Install dependencies**:  
   ```bash
   npm install
   ```

3. **Set up your OpenAI API key**:  
   Create a `.env` file in the chat/ directory with the following content:
   ```
   OPENAI_API_KEY=your-api-key-here
   PORT=5000
   ```
   Replace `your-api-key-here` with your actual OpenAI API key.

4. **Run the server**:  
   ```bash
   node server.js
   ```  
   This will start a local server on port 5000 (or the port specified in your .env file).

5. **Open the applications**:  
   - For the **QVCM Website**, open your browser to: **`http://localhost:5000/`**  
     – This will display the interactive/dynamic webpage explaining the QVCM theory. You can read through the sections of the hypothesis here in a formatted way.  
   - For the **Chat GPT Interface**, open: **`http://localhost:5000/`**  
     – This loads the chat application. You can choose a persona (Specialist or Sage) and ask questions about QVCM. The AI will respond based on the content of the hypothesis.

## Usage Guide

**QVCM Website (`page/index.html`):**  
Navigate through the content which mirrors the QVCM.md document. The site includes multiple sections that match those outlined in the documentation. Use the on-page navigation or scroll to read the hypothesis. It's recommended to start from the introduction to understand the context and then proceed through each numbered section. 

**Chat Application (`chat/index.html`):**  
On loading the chat page, you'll be able to select which AI persona to engage with: 
- **Specialist Persona** – an AI that behaves like a scientist deeply familiar with QVCM, capable of answering technical questions with academic rigor (grounded in physics/neuroscience terminology).  
- **Sage Persona** – an AI that takes on a mystical/philosophical tone (inspired by hermetic and Hindu philosophies) to discuss QVCM in more spiritual or intuitive terms.  

Type your question or prompt in the chat input and submit. The AI will generate a response drawing from the QVCM theory content. You can ask about clarifications of the theory, implications, or even hypothetical scenarios, and the AI will attempt to explain or elaborate from the perspective of QVCM.

*Examples of questions to try:*  
- "**What is the Quantum Vantage Consciousness Model in simple terms?**"  
- "**How does wavefunction collapse relate to making a decision, according to QVCM?**"  
- "**What role does entanglement play in consciousness unity?**" (Specialist persona might reference neuroscience, Sage might reference spiritual unity)  

**Note:** The chat application requires a valid OpenAI API key to function. If responses are not appearing, double-check that the key is correctly provided in your `.env` file.

## Contributing

Contributions to improve the theory or the applications are welcome. This can include:  
- **Theory Discussion**: If you have insights, critiques, or expansions on QVCM, you can open an issue or a discussion. Since QVCM bridges multiple fields, constructive feedback or pointers to relevant research are very valuable.  
- **Documentation**: Spot a typo or unclear explanation in the markdown docs? Feel free to submit a pull request with fixes or enhancements. Clearer examples or additional references that support the hypothesis are also welcome.  
- **Code and Features**: You can improve the website's design, add interactive visualizations, or enhance the chat interface (for example, adding a UI toggle for personas, caching responses, or supporting more AI models). Please open an issue to discuss major changes before implementing, to ensure alignment with the project goals.  

When contributing, please follow a standard GitHub workflow (fork the repo, create a feature branch, submit a PR) and ensure your changes are documented. For any questions, you can contact the repository owner by opening an issue.

## License

This project is open-source under the **MIT License**. You are free to use, modify, and distribute this code and content with proper attribution. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This theory builds upon ideas from quantum mechanics (e.g., superposition, entanglement), theories of consciousness (like Penrose-Hameroff's Orch-OR, the holographic brain principle), and philosophies of mind. The formulation of QVCM was inspired by bridging gaps between these disciplines.  
- This was also large inspired and based upon Orch-OR theory by Stuart Hameroff and Sir Roger Penrose.
- Thanks to anyone who engages with this project. Your interest and feedback help refine the hypothesis and its presentation.

## FAQ

### How is QVCM different from other quantum consciousness theories?
QVCM distinguishes itself by treating every conscious moment as a perception→decision loop whose oneness is variable. Instead of assuming a single self, it models co-active vantage components and tracks how coupling raises or lowers unity. This provides a bridge between quantum substrates, cognitive control, and measurable order parameters beyond traditional neural-correlate approaches.

### What predictions or tests could validate QVCM?
The model points to concrete tests: comparing Orch-OR reconfiguration times (τ ≈ ħ/E_G) with behavioral latencies, tracking how integration metrics rise as synchrony increases oneness, and identifying neural signatures of competing vantage components during conflict tasks. Closed-loop stimulation that merges components should measurably raise the oneness parameter and stabilize decisions.

### Is there empirical support for this hypothesis?
Direct evidence is still emerging, yet QVCM resonates with observations of fluctuating unity (e.g., dissociation, split attention) and the role of oscillatory coupling in coordinating behavior. It offers a quantitative lens for these phenomena and guides new experiments on multiplicity, mergers, and state-dependent memory. 