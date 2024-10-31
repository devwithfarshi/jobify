const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const generateJobDescriptionWithOpenAi = async (
  companyName,
  jobTitle,
  industry,
  skills
) => {
  const prompt = `Generate a detailed job description for a company named "${companyName}" for the position of "${jobTitle}" in the "${industry}" industry. The job description should include :

  1. **Job Overview**: A brief introduction to the role, explaining its importance within the company and the industry.

  2. **Key Responsibilities**: A list of main tasks and responsibilities associated with the position, formatted as bullet points.

  3. **Required Skills**: A detailed list of skills and qualifications necessary for the role, including skills such as ${skills.join(
    ", "
  )}.

  4. **Preferred Qualifications**: Any additional qualifications that would be advantageous for candidates.

  5. **Company Culture**: A description of the company culture and values to provide insight into the work environment.

  6. **Benefits**: A list of benefits and perks that come with the position, such as health insurance, retirement plans, and remote work options.

  7. **How to Apply**: Clear instructions on how candidates can apply for the position.

  The tone should be professional and engaging to attract high-quality candidates.`;
  try {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    return result.response.text();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate job description");
  }
};

module.exports = { generateJobDescriptionWithOpenAi };
