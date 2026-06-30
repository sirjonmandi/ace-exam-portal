export type SessionStatus = "completed" | "available" | "locked";

export interface MockSession {
  id: string;
  name: "Morning Session" | "Afternoon Session";
  status: SessionStatus;
  questions: number;
  duration: string;
}

export interface MockExam {
  id: string;
  number: number;
  title: string;
  description: string;
  progress: number;
  sessions: MockSession[];
}

export const mocks: MockExam[] = [
  {
    id: "mock-1",
    number: 1,
    title: "CFA Level 1 - Mock 1",
    description: "Practice real exam-style questions with timed assessment sessions and performance tracking.",
    progress: 45,
    sessions: [
      { id: "m1-am", name: "Morning Session", status: "completed", questions: 90, duration: "2h 15m" },
      { id: "m1-pm", name: "Afternoon Session", status: "available", questions: 90, duration: "2h 15m" },
    ],
  },
  {
    id: "mock-2",
    number: 2,
    title: "CFA Level 1 - Mock 2",
    description: "Practice real exam-style questions with timed assessment sessions and performance tracking.",
    progress: 0,
    sessions: [
      { id: "m2-am", name: "Morning Session", status: "available", questions: 90, duration: "2h 15m" },
      { id: "m2-pm", name: "Afternoon Session", status: "locked", questions: 90, duration: "2h 15m" },
    ],
  },
  {
    id: "mock-3",
    number: 3,
    title: "CFA Level 1 - Mock 3",
    description: "Advanced full-length mock to simulate the real CFA testing experience end-to-end.",
    progress: 0,
    sessions: [
      { id: "m3-am", name: "Morning Session", status: "locked", questions: 90, duration: "2h 15m" },
      { id: "m3-pm", name: "Afternoon Session", status: "locked", questions: 90, duration: "2h 15m" },
    ],
  },
  {
    id: "mock-4",
    number: 4,
    title: "CFA Level 1 - Mock 4",
    description: "Diagnostic mock focused on quantitative methods and financial reporting analysis.",
    progress: 0,
    sessions: [
      { id: "m4-am", name: "Morning Session", status: "locked", questions: 90, duration: "2h 15m" },
      { id: "m4-pm", name: "Afternoon Session", status: "locked", questions: 90, duration: "2h 15m" },
    ],
  },
  {
    id: "mock-5",
    number: 5,
    title: "CFA Level 1 - Mock 5",
    description: "Comprehensive mock covering all topic areas with a focus on fixed income and derivatives.",
    progress: 0,
    sessions: [
      { id: "m5-am", name: "Morning Session", status: "locked", questions: 90, duration: "2h 15m" },
      { id: "m5-pm", name: "Afternoon Session", status: "locked", questions: 90, duration: "2h 15m" },
    ],
  },
  {
    id: "mock-6",
    number: 6,
    title: "CFA Level 1 - Mock 6",
    description: "Final preparation mock designed to simulate exam-day conditions with full topic coverage.",
    progress: 0,
    sessions: [
      { id: "m6-am", name: "Morning Session", status: "locked", questions: 90, duration: "2h 15m" },
      { id: "m6-pm", name: "Afternoon Session", status: "locked", questions: 90, duration: "2h 15m" },
    ],
  },
];

export const snapshot = {
  mocksCompleted: "1/6",
  questionsSolved: 90,
  averageScore: "74%",
  studyStreak: "12d",
};

export interface Question {
  id: string;
  topic: string;
  prompt: string;
  options: { key: "A" | "B" | "C"; text: string }[];
  answer: "A" | "B" | "C";
}

// ─── Mock 1 · Morning Session (Session 1) ────────────────────────────────────
export const m1AmQuestions: Question[] = [
  {
    id: "m1-am-1", topic: "Ethics",
    prompt: "Joline Campbell, CFA, is working on a report about AZA Autos (AZA), which is developing a fuel-efficient car about which no public information is yet available. Campbell speaks to an industry expert who reveals that AZA has assessed the commercial viability of the project. She then issues a 'buy' recommendation on the stock. Has Campbell most likely violated the Standard relating to material non-public information?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, because she uses information that is not yet public." },
      { key: "C", text: "Yes, because she fails to make her recommendation public." },
    ], answer: "A",
  },
  {
    id: "m1-am-2", topic: "Ethics",
    prompt: "Rex Leopold, CFA, is a financial advisor who plans to leave his employer to start a competing business. During non-business hours and before giving notice, Leopold prepares by obtaining regulatory approvals, leasing office space, and hiring an office manager. Has Leopold most likely violated the Standards?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, the Standard relating to loyalty." },
      { key: "C", text: "Yes, the Standard relating to misconduct." },
    ], answer: "A",
  },
  {
    id: "m1-am-3", topic: "Ethics",
    prompt: "The Standard relating to conduct as participants in CFA Institute programs prohibits candidates from:",
    options: [
      { key: "A", text: "discussing curriculum material with others." },
      { key: "B", text: "expressing their disagreement with CFA Institute on its policies and procedures." },
      { key: "C", text: "disclosing broad topical areas and formulas not tested on the CFA Level I exam." },
    ], answer: "B",
  },
  {
    id: "m1-am-4", topic: "Ethics",
    prompt: "A portfolio manager at a pension fund is instructed by the board of trustees to follow specific investment restrictions that limit the investment universe. The manager believes these restrictions are not in the best interest of the fund members but follows the trustee instructions anyway. Has the manager most likely violated the Standards?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, because the manager was hired based upon his previous investment strategy." },
      { key: "C", text: "Yes, because the restrictions provided by the Trustees are not in the best interest of the members." },
    ], answer: "C",
  },
  {
    id: "m1-am-5", topic: "Ethics",
    prompt: "A 12-year-old investment firm adopts the GIPS standards. To claim compliance with the GIPS standards, the firm is initially required to present GIPS-compliant performance history:",
    options: [
      { key: "A", text: "for at least five years." },
      { key: "B", text: "for at least ten years." },
      { key: "C", text: "since the firm's inception date." },
    ], answer: "A",
  },
  {
    id: "m1-am-6", topic: "Ethics",
    prompt: "Tarik Holle, CFA, is an analyst at a brokerage firm. Holle refers clients to other business units of the bank when clients need those services, receiving referral fees from those units. He does not disclose these referral fees to his clients, treating it as an internal bank arrangement. Has Holle most likely violated the Standards?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, the Standard relating to fair dealing." },
      { key: "C", text: "Yes, the Standard relating to referral fees." },
    ], answer: "C",
  },
  {
    id: "m1-am-7", topic: "Ethics",
    prompt: "A firm claiming compliance with the GIPS standards:",
    options: [
      { key: "A", text: "can claim compliance on specific composites." },
      { key: "B", text: "is responsible for maintaining that compliance." },
      { key: "C", text: "must be verified by an independent third party." },
    ], answer: "B",
  },
  {
    id: "m1-am-8", topic: "Ethics",
    prompt: "In the absence of regulatory guidance, CFA Institute recommends that members maintain their investment research records for at least:",
    options: [
      { key: "A", text: "3 years." },
      { key: "B", text: "5 years." },
      { key: "C", text: "7 years." },
    ], answer: "C",
  },
  {
    id: "m1-am-9", topic: "Ethics",
    prompt: "Vijay Gupta, CFA, manages a voluntary retirement plan's equity portfolio for the First Faithful Church. The plan trustees instruct Gupta not to hold stocks of companies involved in alcohol, tobacco, or gambling, regardless of portfolio constraints. Gupta accepts this mandate but holds such stocks in his other client accounts believing they have the highest alpha. By agreeing to manage the church account under the trustees' standards, does Gupta violate the Standards of Professional Conduct?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, because he holds restricted stocks in other accounts." },
      { key: "C", text: "Yes, because the restrictions conflict with his investment strategy." },
    ], answer: "A",
  },
  {
    id: "m1-am-10", topic: "Ethics",
    prompt: "According to the recommended procedures for compliance with the Standard relating to additional compensation arrangements, a member receiving additional compensation must disclose to his employer in writing:",
    options: [
      { key: "A", text: "the nature of the compensation only." },
      { key: "B", text: "the approximate amount of the compensation only." },
      { key: "C", text: "both the nature of the compensation and the approximate amount of the compensation." },
    ], answer: "B",
  },
  {
    id: "m1-am-11", topic: "Ethics",
    prompt: "Which of the following is a key concept relating to the GIPS standards? The GIPS standards:",
    options: [
      { key: "A", text: "address every aspect of performance measurement." },
      { key: "B", text: "require firms to adhere to certain calculation methodologies to allow for comparability across firms." },
      { key: "C", text: "require the inclusion of all discretionary and non-discretionary accounts in at least one composite." },
    ], answer: "B",
  },
  {
    id: "m1-am-12", topic: "Ethics",
    prompt: "Nash, CFA, resides in Country 1, where applicable law is less strict than the Standards. Nash does business in Country 2, where applicable law is more strict than in Country 1. According to the Standards, when doing business in Country 2, Nash must follow:",
    options: [
      { key: "A", text: "the Code and Standards." },
      { key: "B", text: "applicable law of Country 1." },
      { key: "C", text: "applicable law of Country 2." },
    ], answer: "A",
  },
  {
    id: "m1-am-13", topic: "Ethics",
    prompt: "Trimbach, CFA, works at an investment firm serving individual investors. Trimbach recommends the purchase of German government bonds to a client and tells the client that her government guarantees the promised principal and interest on the bonds. Has Trimbach most likely violated the Standards?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, the Standard relating to misrepresentation." },
      { key: "C", text: "Yes, the Standard relating to communication with clients and prospective clients." },
    ], answer: "A",
  },
  {
    id: "m1-am-14", topic: "Ethics",
    prompt: "Sandra Chen, CFA, works for a research firm. Her group identifies a new volatility investment product as a viable risk reduction strategy and prepares a report. Chen believes the product will be more volatile than the group's model suggests but disagrees with the findings. She agrees to have her name included in the report. Has Chen most likely violated the Standards?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, because she failed to dissociate herself from the report." },
      { key: "C", text: "Yes, because she failed to include her dissenting opinion in the report." },
    ], answer: "A",
  },
  {
    id: "m1-am-15", topic: "Ethics",
    prompt: "Tomas Bo, CFA, receives an unsolicited stock order from a client. He discusses the order with his firm's analyst, who determines the stock is undervalued and suitable for many clients. Bo calls other suitable clients to recommend the stock, then executes a single block trade for the original client and the other clients. Bo most likely violated the Standard(s) relating to:",
    options: [
      { key: "A", text: "neither suitability nor loyalty, prudence, and care." },
      { key: "B", text: "suitability, prudence and care only." },
      { key: "C", text: "both suitability and loyalty, prudence, and care." },
    ], answer: "A",
  },
  {
    id: "m1-am-16", topic: "Ethics",
    prompt: "Alan Quinta, CFA, provides credit rating analysis of high-yield bonds. His firm holds a large amount of bonds of Vreyon Corporation, recently downgraded by all major rating agencies. Despite market concerns, Quinta has not publicly downgraded Vreyon. His supervisor asks him to contact institutional clients and recommend they buy Vreyon bonds at current price levels. The most appropriate action for Quinta is to:",
    options: [
      { key: "A", text: "comply with his supervisor's request." },
      { key: "B", text: "refuse his supervisor's request." },
      { key: "C", text: "promote the bonds with appropriate disclosures." },
    ], answer: "B",
  },
  {
    id: "m1-am-17", topic: "Ethics",
    prompt: "To increase market participants' interest and trading volume in a company's stock, an advisor buys the stock and immediately sells it without causing large price movements. The advisor then shares consensus analyst earnings estimates for the company on social media. Has the advisor most likely violated the Standard relating to market manipulation?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, by sharing analyst earnings estimates for the company on social media." },
      { key: "C", text: "Yes, by buying and selling the company's stock to increase market participants' interest and trading volume." },
    ], answer: "C",
  },
  {
    id: "m1-am-18", topic: "Ethics",
    prompt: "Warren Merz, CFA, manages a short-term corporate bond mutual fund. The president of the parent bank tells Merz the bank needs to sell long-term bonds below purchase price for liquidity. The president asks Merz to buy these bonds for his fund at par, assuring him the bonds will be held to maturity for a full return. Merz purchases the bonds for the fund at 100 as requested. Has Merz most likely violated the Standard(s) relating to:",
    options: [
      { key: "A", text: "suitability only." },
      { key: "B", text: "loyalty, prudence, and care only." },
      { key: "C", text: "both suitability and loyalty, prudence, and care." },
    ], answer: "C",
  },
  {
    id: "m1-am-19", topic: "Ethics",
    prompt: "A member presents investment performance to potential clients. According to the Standard relating to performance presentation, the member is permitted to omit which of the following from his presentation?",
    options: [
      { key: "A", text: "Only simulated results as a source of performance data." },
      { key: "B", text: "Only supporting details of recommendations if the details are made available upon request." },
      { key: "C", text: "Both simulated results and supporting details of recommendations if the details are made available upon request." },
    ], answer: "B",
  },
  {
    id: "m1-am-20", topic: "Ethics",
    prompt: "Maria Bendez, CFA, sends her recommendations to all of her firm's clients but does not disseminate them publicly, even though she believes her recommendations could affect security prices. A client tells her: 'Every time you send me your recommendations, I can buy the stock and gain an advantage over other market participants.' Has Bendez most likely violated the Standards?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, the Standard relating to material nonpublic information." },
      { key: "C", text: "Yes, the Standard relating to fair dealing." },
    ], answer: "A",
  },
  {
    id: "m1-am-21", topic: "Ethics",
    prompt: "Hira Khan, CFA, works at an investment bank. When clients need services from other bank business units, she refers them to those units. She does not disclose the referral fees she receives from those units to her clients, considering them an internal bank arrangement. Has Khan violated the Standards?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, the Standard relating to fair dealing." },
      { key: "C", text: "Yes, the Standard relating to referral fees." },
    ], answer: "C",
  },
  {
    id: "m1-am-22", topic: "Ethics",
    prompt: "John Pendleton, CFA, writes in his firm's promotional material: Statement 1: 'I passed all three CFA Program examinations in three consecutive years.' Statement 2: 'Being a CFA charterholder, I am among the elite of investment professionals.' Has Pendleton most likely violated the Standard(s)?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "By making Statement 1 only." },
      { key: "C", text: "By making Statement 2 only." },
    ], answer: "C",
  },
  {
    id: "m1-am-23", topic: "Ethics",
    prompt: "Which of the following is a recommended procedure for compliance with the Standard relating to responsibilities of supervisors? A supervisor should do all of the following when an employee is discovered to have violated a company policy EXCEPT:",
    options: [
      { key: "A", text: "assess the need for a complete review of all the employee's activities." },
      { key: "B", text: "immediately dismiss the employee without investigation." },
      { key: "C", text: "place appropriate limitations on the wrongdoer pending the outcome of an investigation." },
    ], answer: "B",
  },
  {
    id: "m1-am-24", topic: "Ethics",
    prompt: "Megan Chandra, CFA, manages an oversubscribed IPO suitable for all the accounts she manages. Chandra does not allocate the IPO to her mother's interest-free-paying account or her son's fee-paying account. Has Chandra most likely violated the Standards?",
    options: [
      { key: "A", text: "No." },
      { key: "B", text: "Yes, by not allocating the IPO to her son's account." },
      { key: "C", text: "Yes, by not allocating the IPO to both her son's and her mother's accounts." },
    ], answer: "B",
  },
  {
    id: "m1-am-25", topic: "Ethics",
    prompt: "According to the Standards relating to communication with clients and prospective clients, members are required to inform which of the following of significant risks and limitations to the investment decision-making process?",
    options: [
      { key: "A", text: "Clients only." },
      { key: "B", text: "Prospective clients only." },
      { key: "C", text: "Both clients and prospective clients." },
    ], answer: "C",
  },
  {
    id: "m1-am-26", topic: "Ethics",
    prompt: "According to the CFA Institute Code of Ethics, members are responsible for:",
    options: [
      { key: "A", text: "monitoring their firm's compliance with the Standards." },
      { key: "B", text: "advancing the professional competence of employees in their firm." },
      { key: "C", text: "promoting the integrity of and upholding the rules governing capital markets." },
    ], answer: "C",
  },
  {
    id: "m1-am-27", topic: "Ethics",
    prompt: "Which of the following is an objective of the GIPS standards?",
    options: [
      { key: "A", text: "Establish financial regulation on a global basis." },
      { key: "B", text: "Promote investor interests and instill investor confidence." },
      { key: "C", text: "Develop national standards for calculating investment performance." },
    ], answer: "B",
  },
  {
    id: "m1-am-28", topic: "Quant Methods",
    prompt: "Which statement about AI in Fintech applications is most accurate? AI:",
    options: [
      { key: "A", text: "can perform tasks at levels surpassing human capabilities." },
      { key: "B", text: "eliminates the need for humans in providing investment advice to retail investors." },
      { key: "C", text: "uses models that outperform traditional statistical models in revealing linear relationships." },
    ], answer: "A",
  },
  {
    id: "m1-am-29", topic: "Economics",
    prompt: "An analyst gathers data on three markets. Based on the data, which market is most likely monopolistically competitive?",
    options: [
      { key: "A", text: "Market 1 — few sellers, identical products, significant barriers to entry." },
      { key: "B", text: "Market 2 — one dominant seller, differentiated products, high barriers." },
      { key: "C", text: "Market 3 — many sellers, differentiated products, low barriers to entry." },
    ], answer: "C",
  },
  {
    id: "m1-am-30", topic: "Economics",
    prompt: "With respect to ESG factors, which of the following is most likely categorized as a social issue?",
    options: [
      { key: "A", text: "Deforestation." },
      { key: "B", text: "Labor standards." },
      { key: "C", text: "Bribery and corruption." },
    ], answer: "B",
  },
  {
    id: "m1-am-31", topic: "Economics",
    prompt: "Tiered pricing is best described as:",
    options: [
      { key: "A", text: "charging different prices at different times." },
      { key: "B", text: "charging different prices to different buyers." },
      { key: "C", text: "combining a low equipment price with high-margin pricing on repeat-purchase consumables." },
    ], answer: "B",
  },
  {
    id: "m1-am-32", topic: "Economics",
    prompt: "Which of the following best describes a function of the International Bank for Reconstruction and Development (IBRD)?",
    options: [
      { key: "A", text: "Provides low interest rate loans to developing countries." },
      { key: "B", text: "Regulates cross-border trade relationships on a global scale." },
      { key: "C", text: "Lends foreign currencies on a temporary basis to address balance of payment issues." },
    ], answer: "A",
  },
  {
    id: "m1-am-33", topic: "Financial Reporting",
    prompt: "As a result of an inventory write-down, which of the following financial ratios most likely decreases?",
    options: [
      { key: "A", text: "Quick ratio." },
      { key: "B", text: "Current ratio." },
      { key: "C", text: "Payables turnover ratio." },
    ], answer: "B",
  },
  {
    id: "m1-am-34", topic: "Economics",
    prompt: "Which of the following ranks political systems from the lowest to the highest level of globalization?",
    options: [
      { key: "A", text: "Autarky, bilateralism, hegemony." },
      { key: "B", text: "Autarky, hegemony, bilateralism." },
      { key: "C", text: "Bilateralism, autarky, hegemony." },
    ], answer: "A",
  },
  {
    id: "m1-am-35", topic: "Financial Reporting",
    prompt: "An analyst gathers the following information (in £ millions) about a company's expenditures developing an intangible asset for internal use: research phase costs £10 million, development costs incurred before technical feasibility £7 million, development costs incurred after reaching technical feasibility £15 million. If all criteria for capitalization have been met, the maximum amount of expenditures (in £ millions) eligible for capitalization is most likely:",
    options: [
      { key: "A", text: "10." },
      { key: "B", text: "15." },
      { key: "C", text: "22." },
    ], answer: "B",
  },
  {
    id: "m1-am-36", topic: "Corporate Issuers",
    prompt: "Target capital structure is often expressed using book values of equity and debt because:",
    options: [
      { key: "A", text: "capital structure policy is aligned to measures used by third parties." },
      { key: "B", text: "market values can fluctuate substantially and are not necessarily the appropriate amount of long-term borrowing for the company." },
      { key: "C", text: "for management, the primary concern is the amount and types of capital invested in the company." },
    ], answer: "B",
  },
  {
    id: "m1-am-37", topic: "Quant Methods",
    prompt: "Which of the following statements about the IRR is most accurate?\nStatement 1: The IRR assumes reinvestment of cash flows at the required rate of return.\nStatement 2: IRR is strongly preferred when NPV and IRR rank two mutually exclusive projects differently.\nStatement 3: NPV is zero when IRR equals the hurdle rate.",
    options: [
      { key: "A", text: "Statement 1." },
      { key: "B", text: "Statement 2." },
      { key: "C", text: "Statement 3." },
    ], answer: "C",
  },
  {
    id: "m1-am-38", topic: "Economics",
    prompt: "During the slowdown phase of the business cycle:",
    options: [
      { key: "A", text: "inflation deteriorates." },
      { key: "B", text: "businesses have new orders." },
      { key: "C", text: "business slows its rate of hiring." },
    ], answer: "C",
  },
  {
    id: "m1-am-39", topic: "Financial Reporting",
    prompt: "An analyst gathers the following information about a company's expenditures developing an intangible asset for internal use. Development costs incurred after reaching technical feasibility: £15 million. If all criteria for capitalization have been met, the maximum amount of expenditures (in £ millions) eligible for capitalization is most likely:",
    options: [
      { key: "A", text: "10." },
      { key: "B", text: "15." },
      { key: "C", text: "20." },
    ], answer: "B",
  },
  {
    id: "m1-am-40", topic: "Corporate Issuers",
    prompt: "Target capital structure is often expressed using book values of equity and debt. Which of the following best explains why?",
    options: [
      { key: "A", text: "Capital structure policy is aligned to measures used by third parties." },
      { key: "B", text: "Market values can fluctuate substantially and may not reflect the appropriate long-term borrowing level." },
      { key: "C", text: "For management, the primary concern is the types of capital invested, not market prices." },
    ], answer: "A",
  },
  {
    id: "m1-am-41", topic: "Corporate Issuers",
    prompt: "Which of the following is most appropriate when assessing a company's ability to meet its long-term debt obligations?",
    options: [
      { key: "A", text: "Debt-to-equity ratio." },
      { key: "B", text: "Debt/enterprise ratio." },
      { key: "C", text: "Financial leverage ratio." },
    ], answer: "C",
  },
  {
    id: "m1-am-42", topic: "Quant Methods",
    prompt: "A bank account has a stated annual interest rate of 3.5% with quarterly compounding. If the current value of the account is $100,000, the future value of the account two years from now is closest to:",
    options: [
      { key: "A", text: "$107,123." },
      { key: "B", text: "$107,207." },
      { key: "C", text: "$107,218." },
    ], answer: "C",
  },
  {
    id: "m1-am-43", topic: "Financial Reporting",
    prompt: "An analyst gathers the following information about a company: Total assets Year 2: £90 million, Year 1: £100 million; Total liabilities Year 2: £36 million, Year 1: £40 million. Using vertical common-size balance sheet analysis, the company's total liabilities in Year 2 are closest to:",
    options: [
      { key: "A", text: "40%." },
      { key: "B", text: "36%." },
      { key: "C", text: "38%." },
    ], answer: "A",
  },
  {
    id: "m1-am-44", topic: "Financial Reporting",
    prompt: "An analyst gathers year-end information about a company's current assets and current liabilities. From Year 1 to Year 2, the cash ratio:",
    options: [
      { key: "A", text: "decreased." },
      { key: "B", text: "remained the same." },
      { key: "C", text: "increased." },
    ], answer: "A",
  },
  {
    id: "m1-am-45", topic: "Financial Reporting",
    prompt: "Under US GAAP, which of the following should be reported separately from continuing operations on the income statement?",
    options: [
      { key: "A", text: "Restructuring charges." },
      { key: "B", text: "Gain or loss from sale of an asset." },
      { key: "C", text: "Results of discontinued operations." },
    ], answer: "C",
  },
  {
    id: "m1-am-46", topic: "Economics",
    prompt: "An analyst gathers the following information: USD/EUR spot rate 1.1800; expected USD/EUR spot rate in one year 1.1650. The expected change in value of the dollar relative to the euro over the next year is closest to an(x):",
    options: [
      { key: "A", text: "depreciation of 1.27%." },
      { key: "B", text: "appreciation of 1.27%." },
      { key: "C", text: "appreciation of 1.29%." },
    ], answer: "C",
  },
  {
    id: "m1-am-47", topic: "Economics",
    prompt: "Assume that a central bank has decided to lower interest rates in the economy. To carry out this policy, the central bank will most likely:",
    options: [
      { key: "A", text: "sell securities." },
      { key: "B", text: "buy securities." },
      { key: "C", text: "increase required reserve requirements." },
    ], answer: "B",
  },
  {
    id: "m1-am-48", topic: "Financial Reporting",
    prompt: "An analyst gathers information (in £ millions) about a company's current assets and current liabilities: Cash 0.5, Short-term marketable investments 0.5, Receivables 1.5, Inventory 5.0, Current liabilities 5.0. The quick ratio is closest to:",
    options: [
      { key: "A", text: "0.20." },
      { key: "B", text: "0.30." },
      { key: "C", text: "0.50." },
    ], answer: "B",
  },
  {
    id: "m1-am-49", topic: "Corporate Issuers",
    prompt: "Proxy voting is best defined as a means for:",
    options: [
      { key: "A", text: "shareholders to convey their preferences to management." },
      { key: "B", text: "would-be acquirers to gain control of the company." },
      { key: "C", text: "shareholders voting without attending a meeting in person." },
    ], answer: "C",
  },
  {
    id: "m1-am-50", topic: "Quant Methods",
    prompt: "The NZD/EUR spot rate is 1.5415. If the 3-month forward discount on NZD is 24 points, the 3-month forward rate is closest to:",
    options: [
      { key: "A", text: "1.54270." },
      { key: "B", text: "1.54290." },
      { key: "C", text: "1.54901." },
    ], answer: "A",
  },
  {
    id: "m1-am-51", topic: "Quant Methods",
    prompt: "An analyst calculates the following metrics about a sample of paired observations of a dependent variable Y and an independent variable X: Variance of X = 17, Variance of Y = 53, Covariance of X and Y = 17. Based on the sample, the slope coefficient of the simple linear regression of Y to X is closest to:",
    options: [
      { key: "A", text: "0.85." },
      { key: "B", text: "0.89." },
      { key: "C", text: "1.33." },
    ], answer: "C",
  },
  {
    id: "m1-am-52", topic: "Quant Methods",
    prompt: "The third quintile corresponds to the:",
    options: [
      { key: "A", text: "40th percentile." },
      { key: "B", text: "50th percentile." },
      { key: "C", text: "60th percentile." },
    ], answer: "C",
  },
  {
    id: "m1-am-53", topic: "Quant Methods",
    prompt: "Goodness-of-fit measures derived from analysis of variance (ANOVA) data most likely include:",
    options: [
      { key: "A", text: "coefficient of variation." },
      { key: "B", text: "regression coefficients." },
      { key: "C", text: "standard error of the estimate." },
    ], answer: "C",
  },
  {
    id: "m1-am-54", topic: "Financial Reporting",
    prompt: "PP&E may be reported above its historical cost on the balance sheet under:",
    options: [
      { key: "A", text: "the revaluation model only." },
      { key: "B", text: "the cost model only." },
      { key: "C", text: "both the cost model and the revaluation model." },
    ], answer: "A",
  },
  {
    id: "m1-am-55", topic: "Corporate Issuers",
    prompt: "An analyst gathers the following information: Market value of equity $64 million, Market value of debt $16 million, Before-tax cost of debt 5%, Marginal tax rate 30%. The company's WACC is closest to:",
    options: [
      { key: "A", text: "11.00%." },
      { key: "B", text: "11.50%." },
      { key: "C", text: "11.90%." },
    ], answer: "B",
  },
  {
    id: "m1-am-56", topic: "Financial Reporting",
    prompt: "An analyst uses the following information to forecast a company's gross profit margin. Current sales: $1,100, forecasted sales growth: 5%; current cost of sales: $900, forecasted cost growth: 6%. The analyst's gross profit margin forecast would be closest to a:",
    options: [
      { key: "A", text: "decrease of 1%." },
      { key: "B", text: "no change." },
      { key: "C", text: "increase of 1%." },
    ], answer: "A",
  },
  {
    id: "m1-am-57", topic: "Quant Methods",
    prompt: "A series of annual tuition payments of $25,000 each will begin exactly 20 years from today. If the stated discount rate is 4%, the required investment today to fund all five payments is closest to:",
    options: [
      { key: "A", text: "$53,794." },
      { key: "B", text: "$52,826." },
      { key: "C", text: "$54,933." },
    ], answer: "B",
  },
  {
    id: "m1-am-58", topic: "Financial Reporting",
    prompt: "A company that reports the results from two different segments as a combined entity best describes a(n):",
    options: [
      { key: "A", text: "subsidiary." },
      { key: "B", text: "company reporting combined entity segments." },
      { key: "C", text: "holding company." },
    ], answer: "B",
  },
  {
    id: "m1-am-59", topic: "Corporate Issuers",
    prompt: "Which of the following types of business structures are most likely subject to unlimited liability?",
    options: [
      { key: "A", text: "Corporations." },
      { key: "B", text: "Limited partnerships." },
      { key: "C", text: "General partnerships." },
    ], answer: "C",
  },
  {
    id: "m1-am-60", topic: "Financial Reporting",
    prompt: "An analyst gathers information (in $ millions) about three companies. Company 1: Cash 2.5, S-T investments 2.0, Receivables 3.0, Inventory 5.0, Current liabilities 5.0. Company 2: Cash 2.0, S-T investments 2.0, Receivables 2.0, Inventory 3.0, Current liabilities 3.0. Company 3: Cash 2.5, S-T investments 3.0, Receivables 2.0, Inventory 3.5, Current liabilities 5.0. Based on the quick ratio, which company exhibits the lowest liquidity risk?",
    options: [
      { key: "A", text: "Company 1." },
      { key: "B", text: "Company 2." },
      { key: "C", text: "Company 3." },
    ], answer: "B",
  },
  {
    id: "m1-am-61", topic: "Financial Reporting",
    prompt: "For a company paying preferred dividends, the components needed to compute basic EPS are:",
    options: [
      { key: "A", text: "net income and the weighted average number of common shares outstanding." },
      { key: "B", text: "net income, preferred dividends, and the weighted average number of common shares outstanding." },
      { key: "C", text: "preferred dividends, additional shares issued if converted, and weighted average common shares." },
    ], answer: "B",
  },
  {
    id: "m1-am-62", topic: "Economics",
    prompt: "Economic profit:",
    options: [
      { key: "A", text: "cannot be earned." },
      { key: "B", text: "can be earned in the short run only." },
      { key: "C", text: "can be earned in both the short and the long run." },
    ], answer: "B",
  },
  {
    id: "m1-am-63", topic: "Financial Reporting",
    prompt: "An analyst reviewing a company's solvency over two years finds: Year 2 total debt $2,100, shareholders' equity $7,000, interest coverage 2.9; Year 1 total debt $2,400, shareholders' equity $17,000, interest coverage 2.2. Compared with Year 1, the company's solvency in Year 2 has most likely:",
    options: [
      { key: "A", text: "declined because both ratios have weakened." },
      { key: "B", text: "remained the same." },
      { key: "C", text: "improved because both ratios have strengthened." },
    ], answer: "C",
  },
  {
    id: "m1-am-64", topic: "Quant Methods",
    prompt: "In hypothesis testing, the critical value is determined by the:",
    options: [
      { key: "A", text: "p-value." },
      { key: "B", text: "sample's mean." },
      { key: "C", text: "level of significance." },
    ], answer: "C",
  },
  {
    id: "m1-am-65", topic: "Economics",
    prompt: "If the prices of tech stocks usually rise when interest rates fall, the correlation between the two variables is most likely:",
    options: [
      { key: "A", text: "negative." },
      { key: "B", text: "zero." },
      { key: "C", text: "positive." },
    ], answer: "A",
  },
  {
    id: "m1-am-66", topic: "Financial Reporting",
    prompt: "Interest payable decreased during a company's fiscal year. Compared with the amount of cash interest payments made, interest expense is most likely:",
    options: [
      { key: "A", text: "lower." },
      { key: "B", text: "the same." },
      { key: "C", text: "higher." },
    ], answer: "A",
  },
  {
    id: "m1-am-67", topic: "Quant Methods",
    prompt: "An analyst gathers year-end prices for a non-dividend-paying stock purchased at end of Year 1 and sold at end of Year 3: Year 1: €0 (purchase price €10), Year 2: €2, Year 3: €12. Which of the following returns is the largest?",
    options: [
      { key: "A", text: "The geometric mean annual return." },
      { key: "B", text: "The arithmetic mean annual return." },
      { key: "C", text: "The two-year holding period return." },
    ], answer: "C",
  },
  {
    id: "m1-am-68", topic: "Financial Reporting",
    prompt: "Under converged accounting standards for revenue recognition, a contract asset is most likely recognized when:",
    options: [
      { key: "A", text: "goods or services are delivered and payment is received." },
      { key: "B", text: "payment is received in advance of transferring the goods or services." },
      { key: "C", text: "revenue is recognized related to some contractual performance obligations that have been met." },
    ], answer: "C",
  },
  {
    id: "m1-am-69", topic: "Financial Reporting",
    prompt: "Which of the following statements relating to the financial reporting of defined-contribution plans is most correct?",
    options: [
      { key: "A", text: "The whole liability from contributions to defined-contribution plans is on an asset account." },
      { key: "B", text: "Under a defined-contribution plan, company contributions to the plan are treated as an operating cash flow." },
      { key: "C", text: "Defined-contribution plans require companies to make several assumptions to estimate pension obligations." },
    ], answer: "B",
  },
  {
    id: "m1-am-70", topic: "Financial Reporting",
    prompt: "Line items expressed as a percentage of net revenue appear on which of the following common-size financial statements?",
    options: [
      { key: "A", text: "The income statement only." },
      { key: "B", text: "The statement of cash flows only." },
      { key: "C", text: "Both the income statement and the statement of cash flows." },
    ], answer: "C",
  },
  {
    id: "m1-am-71", topic: "Quant Methods",
    prompt: "An analyst gathers annual returns on a stock: Year 1: 5%, Year 2: −2%, Year 3: 3%, Year 4: 8%. If the target annual return is 4%, the sample semideviation of returns is closest to:",
    options: [
      { key: "A", text: "3.0%." },
      { key: "B", text: "3.5%." },
      { key: "C", text: "4.2%." },
    ], answer: "B",
  },
  {
    id: "m1-am-72", topic: "Corporate Issuers",
    prompt: "A manufacturing company decides to invest in the maintenance of its IT hardware and software. This best describes a(n):",
    options: [
      { key: "A", text: "expansion project." },
      { key: "B", text: "going concern project." },
      { key: "C", text: "innovation opportunity." },
    ], answer: "B",
  },
  {
    id: "m1-am-73", topic: "Financial Reporting",
    prompt: "A retailer prepares statements under IFRS and holds 100 office chairs. Retail price: $240 each, cost: $200 each. The supplier now offers the same chairs for $160. Estimated selling costs are $30 per chair. The total carrying amount of these 100 office chairs on the retailer's balance sheet is closest to:",
    options: [
      { key: "A", text: "$16,000." },
      { key: "B", text: "$17,000." },
      { key: "C", text: "$20,000." },
    ], answer: "B",
  },
  {
    id: "m1-am-74", topic: "Financial Reporting",
    prompt: "Which of the following statements about the role of financial reporting is most accurate? Financial reporting is intended to:",
    options: [
      { key: "A", text: "forecast future net income and cash flow." },
      { key: "B", text: "provide a basis for securities valuation decisions." },
      { key: "C", text: "provide information about a company's performance, financial position, and changes in financial position." },
    ], answer: "C",
  },
  {
    id: "m1-am-75", topic: "Financial Reporting",
    prompt: "Which of the following financial statement disclosures regarding inventory are required under both IFRS and US GAAP?",
    options: [
      { key: "A", text: "Events leading to a reversal of a write-down." },
      { key: "B", text: "Any reversal of any write-down of any inventory." },
      { key: "C", text: "The amount of any write-down recognized as an expense." },
    ], answer: "C",
  },
  {
    id: "m1-am-76", topic: "Corporate Issuers",
    prompt: "The principal tool used to align the interests of management and shareholders is:",
    options: [
      { key: "A", text: "regulation." },
      { key: "B", text: "proxy voting." },
      { key: "C", text: "compensation." },
    ], answer: "C",
  },
  {
    id: "m1-am-77", topic: "Economics",
    prompt: "The redistribution of income and wealth is most directly associated with:",
    options: [
      { key: "A", text: "fiscal policy only." },
      { key: "B", text: "monetary policy only." },
      { key: "C", text: "both fiscal and monetary policy." },
    ], answer: "A",
  },
  {
    id: "m1-am-78", topic: "Financial Reporting",
    prompt: "Deductible temporary differences arise when:",
    options: [
      { key: "A", text: "taxable income exceeds accounting profit." },
      { key: "B", text: "carrying amount of an asset exceeds its tax base." },
      { key: "C", text: "financial accounting income exceeds income taxes payable." },
    ], answer: "A",
  },
  {
    id: "m1-am-79", topic: "Quant Methods",
    prompt: "Sampling error is the difference between the observed value of a statistic and the:",
    options: [
      { key: "A", text: "mean of the sample." },
      { key: "B", text: "quantity it is intended to estimate." },
      { key: "C", text: "observed value of the random variable." },
    ], answer: "B",
  },
  {
    id: "m1-am-80", topic: "Fixed Income",
    prompt: "An analyst estimates the following risk premiums for a long-term corporate bond: Inflation premium 1.5%, Default risk premium 2.0%, Liquidity premium 0.5%, Maturity premium 3.5%. If the short-term nominal risk-free interest rate is 4.0%, the yield on the bond is closest to:",
    options: [
      { key: "A", text: "6.0%." },
      { key: "B", text: "8.5%." },
      { key: "C", text: "11.5%." },
    ], answer: "B",
  },
  {
    id: "m1-am-81", topic: "Economics",
    prompt: "An increase in which of the following will most likely allow governments to directly change income distribution?",
    options: [
      { key: "A", text: "Transfer payments." },
      { key: "B", text: "Flat income tax rates." },
      { key: "C", text: "Infrastructure investments." },
    ], answer: "A",
  },
  {
    id: "m1-am-82", topic: "Financial Reporting",
    prompt: "Significant changes in the marketplace have caused demand for a company's product to decline. The patent under which the product is produced has: Undiscounted future cash flows $38,000, PV of future cash flows $32,000, Costs to sell $34,000, Carrying value $4,000 ($ thousands). The patent is impaired under:",
    options: [
      { key: "A", text: "IFRS only." },
      { key: "B", text: "US GAAP only." },
      { key: "C", text: "both IFRS and US GAAP." },
    ], answer: "A",
  },
  {
    id: "m1-am-83", topic: "Economics",
    prompt: "A liquidity trap is most closely associated with:",
    options: [
      { key: "A", text: "deflation." },
      { key: "B", text: "an inelastic demand for money." },
      { key: "C", text: "a positive nominal central bank policy rate." },
    ], answer: "A",
  },
  {
    id: "m1-am-84", topic: "Economics",
    prompt: "If an exchange rate between two currencies has decreased to 1.3500 and the base currency has depreciated by 7% against the price currency, the initial exchange rate between the two currencies was closest to:",
    options: [
      { key: "A", text: "1.2817." },
      { key: "B", text: "1.4445." },
      { key: "C", text: "1.4516." },
    ], answer: "C",
  },
  {
    id: "m1-am-85", topic: "Corporate Issuers",
    prompt: "If interest is tax deductible, as the tax rate increases, the after-tax cost of debt for a company:",
    options: [
      { key: "A", text: "decreases." },
      { key: "B", text: "remains the same." },
      { key: "C", text: "increases." },
    ], answer: "A",
  },
  {
    id: "m1-am-86", topic: "Economics",
    prompt: "Firms in monopolistic competition most likely have:",
    options: [
      { key: "A", text: "no pricing power." },
      { key: "B", text: "some pricing power." },
      { key: "C", text: "substantial pricing power." },
    ], answer: "B",
  },
  {
    id: "m1-am-87", topic: "Financial Reporting",
    prompt: "Amounts recorded as deferred revenue most likely become included in income when they are:",
    options: [
      { key: "A", text: "paid." },
      { key: "B", text: "earned." },
      { key: "C", text: "invoiced." },
    ], answer: "B",
  },
  {
    id: "m1-am-88", topic: "Economics",
    prompt: "The role of lender of last resort in an economy is most likely fulfilled by the:",
    options: [
      { key: "A", text: "government." },
      { key: "B", text: "central bank." },
      { key: "C", text: "banking system." },
    ], answer: "B",
  },
  {
    id: "m1-am-89", topic: "Economics",
    prompt: "Which of the following attributes is most accurate for a typical company in its start-up stage?",
    options: [
      { key: "A", text: "Cash flows are negative." },
      { key: "B", text: "The company can raise equity in public markets." },
      { key: "C", text: "Debt is a significant component of the capital structure." },
    ], answer: "A",
  },
  {
    id: "m1-am-90", topic: "Quant Methods",
    prompt: "Monte Carlo simulations:",
    options: [
      { key: "A", text: "require analytical pricing formulas to value securities." },
      { key: "B", text: "can be used as a complement to analytical methods." },
      { key: "C", text: "provide better insight than analytical methods in cause-and-effect relationships." },
    ], answer: "B",
  },
];

// ─── Mock 1 · Afternoon Session (Session 2) ───────────────────────────────────
export const m1PmQuestions: Question[] = [
  {
    id: "m1-pm-1", topic: "Derivatives",
    prompt: "Valuation of a swap during its life will least likely involve the:",
    options: [
      { key: "A", text: "use of replication." },
      { key: "B", text: "investor's risk aversion." },
      { key: "C", text: "application of the principle of no arbitrage." },
    ], answer: "B",
  },
  {
    id: "m1-pm-2", topic: "Portfolio Management",
    prompt: "A passive investment strategy most likely outperforms an active investment strategy when:",
    options: [
      { key: "A", text: "there are few market participants." },
      { key: "B", text: "asset prices reflect information quickly." },
      { key: "C", text: "intrinsic values are less than market values." },
    ], answer: "B",
  },
  {
    id: "m1-pm-3", topic: "Fixed Income",
    prompt: "A bond that allows the issuer to pay interest in the form of additional amounts of the existing bond issue rather than a cash payment best describes a:",
    options: [
      { key: "A", text: "step-up coupon bond." },
      { key: "B", text: "deferred coupon bond." },
      { key: "C", text: "payment-in-kind coupon bond." },
    ], answer: "C",
  },
  {
    id: "m1-pm-4", topic: "Equity",
    prompt: "The justified forward P/E ratio calculated based on the Gordon growth model is always positively related to the:",
    options: [
      { key: "A", text: "payout ratio." },
      { key: "B", text: "dividend growth rate." },
      { key: "C", text: "required rate of return." },
    ], answer: "B",
  },
  {
    id: "m1-pm-5", topic: "Alternative Investments",
    prompt: "With respect to leveraged buyouts, the current management team will continue to manage the company in:",
    options: [
      { key: "A", text: "management buy-ins only." },
      { key: "B", text: "management buyouts only." },
      { key: "C", text: "both management buy-ins and management buyouts." },
    ], answer: "B",
  },
  {
    id: "m1-pm-6", topic: "Equity",
    prompt: "Electronic trading in cryptocurrencies on centralized exchanges is most likely:",
    options: [
      { key: "A", text: "hosted on public servers." },
      { key: "B", text: "direct without any intermediating broker or dealer." },
      { key: "C", text: "regulated to the same standard as exchanges for more traditional assets." },
    ], answer: "B",
  },
  {
    id: "m1-pm-7", topic: "Portfolio Management",
    prompt: "Which of the following objectives of a client's IPS is best described as a relative objective? For the next year, a client's portfolio objective is to:",
    options: [
      { key: "A", text: "have a 95% value at risk that is less than $100,000." },
      { key: "B", text: "outperform the local stock market index by 100 basis points." },
      { key: "C", text: "earn a return within plus or minus 2 percentage points of the local stock market index return." },
    ], answer: "C",
  },
  {
    id: "m1-pm-8", topic: "Fixed Income",
    prompt: "Which of the following is NOT a credit enhancement in asset-backed securities?",
    options: [
      { key: "A", text: "Credit tranching." },
      { key: "B", text: "Overcollateralization." },
      { key: "C", text: "Representations and warranties." },
    ], answer: "C",
  },
  {
    id: "m1-pm-9", topic: "Fixed Income",
    prompt: "A bond has an annual modified duration of 5.359, an annual convexity of 248.23, and is currently yielding 3.5%. If the bond's yield-to-maturity increases to 3.7%, the expected percentage price change is closest to:",
    options: [
      { key: "A", text: "−1.02%." },
      { key: "B", text: "−0.97%." },
      { key: "C", text: "+1.12%." },
    ], answer: "A",
  },
  {
    id: "m1-pm-10", topic: "Alternative Investments",
    prompt: "In limited partnership agreements, which of the following benefits the general partner?",
    options: [
      { key: "A", text: "Catch-up clause." },
      { key: "B", text: "Clawback provision." },
      { key: "C", text: "High-water mark clause." },
    ], answer: "A",
  },
  {
    id: "m1-pm-11", topic: "Alternative Investments",
    prompt: "Which of the following methods of investing in alternative investments requires the least amount of investment expertise?",
    options: [
      { key: "A", text: "Co-investing." },
      { key: "B", text: "Fund investing." },
      { key: "C", text: "Direct investing." },
    ], answer: "B",
  },
  {
    id: "m1-pm-12", topic: "Equity",
    prompt: "The first decision when constructing a security market index is most likely:",
    options: [
      { key: "A", text: "identifying the target market." },
      { key: "B", text: "identifying the investment universe." },
      { key: "C", text: "determining the constituent securities." },
    ], answer: "A",
  },
  {
    id: "m1-pm-13", topic: "Alternative Investments",
    prompt: "The assets underlying an infrastructure investment are most likely:",
    options: [
      { key: "A", text: "intended for private use." },
      { key: "B", text: "owned by a government entity." },
      { key: "C", text: "expected to have a short operational life." },
    ], answer: "B",
  },
  {
    id: "m1-pm-14", topic: "Portfolio Management",
    prompt: "During times of severe market turmoil, the risk reduction from portfolio diversification most likely:",
    options: [
      { key: "A", text: "decreases." },
      { key: "B", text: "remains the same." },
      { key: "C", text: "increases." },
    ], answer: "A",
  },
  {
    id: "m1-pm-15", topic: "Corporate Issuers",
    prompt: "Free cash flow to equity (FCFE) is equal to cash flow from operations:",
    options: [
      { key: "A", text: "less fixed capital investment less net borrowing." },
      { key: "B", text: "less fixed capital investment plus net borrowing." },
      { key: "C", text: "plus fixed capital investment plus net borrowing." },
    ], answer: "B",
  },
  {
    id: "m1-pm-16", topic: "Fixed Income",
    prompt: "A 5% corporate bond makes annual coupon payments on 19 March of each year. If the bond is priced for settlement on 25 March at a yield-to-maturity of 5%, its flat price is:",
    options: [
      { key: "A", text: "below par." },
      { key: "B", text: "par." },
      { key: "C", text: "above par." },
    ], answer: "A",
  },
  {
    id: "m1-pm-17", topic: "Portfolio Management",
    prompt: "A good risk management framework:",
    options: [
      { key: "A", text: "is a top-down process and guidance directing risk management activities." },
      { key: "B", text: "seeks to prioritize avoidance of financial loss over defining policies and processes." },
      { key: "C", text: "is typically a process that addresses a common set of factors within different organizations." },
    ], answer: "C",
  },
  {
    id: "m1-pm-18", topic: "Portfolio Management",
    prompt: "Indifference curves are plotted on a graph with returns on the vertical axis and risk on the horizontal axis. For a risk-averse investor, the slope of the indifference curve is most likely:",
    options: [
      { key: "A", text: "negative." },
      { key: "B", text: "zero." },
      { key: "C", text: "positive." },
    ], answer: "C",
  },
  {
    id: "m1-pm-19", topic: "Derivatives",
    prompt: "In the binomial option model, when the volatility of the underlying increases, the value of a call option:",
    options: [
      { key: "A", text: "decreases." },
      { key: "B", text: "remains unchanged." },
      { key: "C", text: "increases." },
    ], answer: "C",
  },
  {
    id: "m1-pm-20", topic: "Derivatives",
    prompt: "A company issues 5-year quarterly fixed-rate bonds. Its treasurer expects interest rates to decline for at least the next year and enters into a 1-year agreement with a bank to receive quarterly fixed-rate payments and to make payments based on floating rates benchmarked to a 3-month reference rate. This agreement is best described as a:",
    options: [
      { key: "A", text: "swap." },
      { key: "B", text: "futures contract." },
      { key: "C", text: "forward contract." },
    ], answer: "A",
  },
  {
    id: "m1-pm-21", topic: "Equity",
    prompt: "A trader buys 500 shares of a stock on margin at $36 per share using an initial leverage ratio of 1.66. The maintenance margin for the position is 30%. The stock price at which a margin call will occur is closest to:",
    options: [
      { key: "A", text: "$20.57." },
      { key: "B", text: "$25.20." },
      { key: "C", text: "$30.86." },
    ], answer: "A",
  },
  {
    id: "m1-pm-22", topic: "Fixed Income",
    prompt: "The type of developed market bond that most likely has the greatest risk of default is a:",
    options: [
      { key: "A", text: "revenue bond." },
      { key: "B", text: "sovereign bond." },
      { key: "C", text: "general obligation bond." },
    ], answer: "A",
  },
  {
    id: "m1-pm-23", topic: "Equity",
    prompt: "An index provider launches a new index that will include value stocks in a specific country. The index will most likely be a:",
    options: [
      { key: "A", text: "style index." },
      { key: "B", text: "large capitalization index." },
      { key: "C", text: "fundamentally weighted index." },
    ], answer: "A",
  },
  {
    id: "m1-pm-24", topic: "Equity",
    prompt: "Market microstructure most likely:",
    options: [
      { key: "A", text: "enables investors to generate consistent abnormal returns." },
      { key: "B", text: "helps participants understand the value implications of information." },
      { key: "C", text: "attempts to profit by looking at patterns of prices and trading volumes." },
    ], answer: "B",
  },
  {
    id: "m1-pm-25", topic: "Fixed Income",
    prompt: "The yield-to-maturity of a 5-year, 8% annual-pay bond priced at 108.42 is closest to:",
    options: [
      { key: "A", text: "6.00%." },
      { key: "B", text: "5.38%." },
      { key: "C", text: "7.04%." },
    ], answer: "A",
  },
  {
    id: "m1-pm-26", topic: "Fixed Income",
    prompt: "For an option-free bond, effective duration:",
    options: [
      { key: "A", text: "will be equal to modified duration if the yield curve is absolutely flat." },
      { key: "B", text: "measures interest rate risk for both parallel and non-parallel yield curve shifts." },
      { key: "C", text: "is an estimate of the percentage change in bond price given a change in the bond's yield to maturity." },
    ], answer: "A",
  },
  {
    id: "m1-pm-27", topic: "Fixed Income",
    prompt: "Which of the following markets is most likely to have fewer reporting, regulatory, and tax constraints?",
    options: [
      { key: "A", text: "Eurobond markets." },
      { key: "B", text: "Foreign bond markets." },
      { key: "C", text: "Domestic bond markets." },
    ], answer: "A",
  },
  {
    id: "m1-pm-28", topic: "Portfolio Management",
    prompt: "The correlation between the returns of a risk-free asset and a portfolio of risky assets is:",
    options: [
      { key: "A", text: "−1." },
      { key: "B", text: "zero." },
      { key: "C", text: "positive." },
    ], answer: "B",
  },
  {
    id: "m1-pm-29", topic: "Fixed Income",
    prompt: "A 6% 25-year bond with semiannual payments has a market price of $850.00. The yield to maturity of this bond is closest to:",
    options: [
      { key: "A", text: "6.00%." },
      { key: "B", text: "7.32%." },
      { key: "C", text: "7.91%." },
    ], answer: "B",
  },
  {
    id: "m1-pm-30", topic: "Fixed Income",
    prompt: "The motivation for investing in the mezzanine tranche of a collateralized debt obligation (CDO) is most likely to:",
    options: [
      { key: "A", text: "benefit from the credit protection provided by the senior tranche." },
      { key: "B", text: "earn a higher yield than that on a comparably rated corporate bond." },
      { key: "C", text: "receive a return in excess of what is paid out to all other bond classes." },
    ], answer: "B",
  },
  {
    id: "m1-pm-31", topic: "Fixed Income",
    prompt: "An investor holds a bond with yield-to-maturity 10% and modified duration 0.57. If the duration gap is zero, the investment horizon is closest to:",
    options: [
      { key: "A", text: "3.2 years." },
      { key: "B", text: "5.7 years." },
      { key: "C", text: "6.3 years." },
    ], answer: "C",
  },
  {
    id: "m1-pm-32", topic: "Portfolio Management",
    prompt: "The CAPM states that two assets with the same expected return will have the same:",
    options: [
      { key: "A", text: "standard deviation." },
      { key: "B", text: "correlation of returns with the market." },
      { key: "C", text: "covariance of returns with the market." },
    ], answer: "C",
  },
  {
    id: "m1-pm-33", topic: "Fixed Income",
    prompt: "The sensitivity of a 30-year fixed-rate bond to a 50 basis points increase in the benchmark rate at the 25–30 year maturity segment is best measured by:",
    options: [
      { key: "A", text: "key rate duration." },
      { key: "B", text: "effective duration." },
      { key: "C", text: "modified duration." },
    ], answer: "A",
  },
  {
    id: "m1-pm-34", topic: "Derivatives",
    prompt: "A put option trades for $1.00 with an exercise price of $40.00. If the price of the underlying at expiration is $35.00, the profit for a put seller is:",
    options: [
      { key: "A", text: "$5.00." },
      { key: "B", text: "−$4.00." },
      { key: "C", text: "−$5.00." },
    ], answer: "B",
  },
  {
    id: "m1-pm-35", topic: "Alternative Investments",
    prompt: "Investing in private debt most likely is:",
    options: [
      { key: "A", text: "less risky than investing in traditional bonds." },
      { key: "B", text: "equally risky as investing in traditional bonds." },
      { key: "C", text: "more risky than investing in traditional bonds." },
    ], answer: "C",
  },
  {
    id: "m1-pm-36", topic: "Fixed Income",
    prompt: "An investor purchases a 5% coupon bond maturing in 15 years at par value. Immediately after purchase, the yield required by the market increases. The investor would then most likely have bought the bond at:",
    options: [
      { key: "A", text: "par." },
      { key: "B", text: "a discount." },
      { key: "C", text: "a premium." },
    ], answer: "B",
  },
  {
    id: "m1-pm-37", topic: "Fixed Income",
    prompt: "A semiannual pay bond has a yield-to-maturity of 4.3% quoted on a semiannual bond basis. The yield-to-maturity based on quarterly compounding is closest to:",
    options: [
      { key: "A", text: "4.19%." },
      { key: "B", text: "4.28%." },
      { key: "C", text: "4.31%." },
    ], answer: "B",
  },
  {
    id: "m1-pm-38", topic: "Derivatives",
    prompt: "The value of a European put is:",
    options: [
      { key: "A", text: "inversely related to the exercise price." },
      { key: "B", text: "inversely related to the risk-free interest rate." },
      { key: "C", text: "directly related to the value of the underlying." },
    ], answer: "B",
  },
  {
    id: "m1-pm-39", topic: "Equity",
    prompt: "An asset-based valuation model would be most applicable:",
    options: [
      { key: "A", text: "for valuing a small and privately held firm." },
      { key: "B", text: "when the economic environment is hyperinflationary." },
      { key: "C", text: "for valuing a firm that has significant property, plant, and equipment." },
    ], answer: "A",
  },
  {
    id: "m1-pm-40", topic: "Alternative Investments",
    prompt: "A disadvantage of a fund of hedge funds as compared to a large multi-strategy fund is:",
    options: [
      { key: "A", text: "less due diligence expertise." },
      { key: "B", text: "higher management fees." },
      { key: "C", text: "less diversified exposure to hedge fund strategies." },
    ], answer: "B",
  },
  {
    id: "m1-pm-41", topic: "Derivatives",
    prompt: "For a put option, if the price of the underlying is greater than the exercise price, the put option is:",
    options: [
      { key: "A", text: "in the money." },
      { key: "B", text: "at the money." },
      { key: "C", text: "out of the money." },
    ], answer: "C",
  },
  {
    id: "m1-pm-42", topic: "Derivatives",
    prompt: "Compared to exchange-traded derivative markets, over-the-counter derivative markets are typically more:",
    options: [
      { key: "A", text: "liquid." },
      { key: "B", text: "flexible." },
      { key: "C", text: " " },
    ], answer: "B",
  },
  {
    id: "m1-pm-43", topic: "Alternative Investments",
    prompt: "With regard to commodities, it is most likely true that:",
    options: [
      { key: "A", text: "exposure is most commonly achieved via commodity derivatives." },
      { key: "B", text: "their returns are based on an income stream such as interest or dividends." },
      { key: "C", text: "they are physical products so most investors prefer to trade the actual commodity." },
    ], answer: "A",
  },
  {
    id: "m1-pm-44", topic: "Equity",
    prompt: "An analyst forecasts different scenarios for a company next year using Bear Case, Base Case, and Bull Case with varying sales and EBITDA margin assumptions. This forecast table is best described as a:",
    options: [
      { key: "A", text: "scenario analysis." },
      { key: "B", text: "sensitivity analysis." },
      { key: "C", text: "point estimate forecast." },
    ], answer: "A",
  },
  {
    id: "m1-pm-45", topic: "Derivatives",
    prompt: "During its life, the value of a forward contract is most likely equal to the difference between the current spot price and the original forward price:",
    options: [
      { key: "A", text: "undiscounted." },
      { key: "B", text: "discounted at the risk-free rate from inception." },
      { key: "C", text: "forward, discounted over the remaining term of the contract." },
    ], answer: "C",
  },
  {
    id: "m1-pm-46", topic: "Portfolio Management",
    prompt: "According to the capital asset pricing model (CAPM), the difference in expected returns between two securities is determined by the:",
    options: [
      { key: "A", text: "total risk." },
      { key: "B", text: "systematic risk only." },
      { key: "C", text: "nonsystematic risk." },
    ], answer: "B",
  },
  {
    id: "m1-pm-47", topic: "Portfolio Management",
    prompt: "Which of the following performance measures is most appropriate for an investor who holds a well-diversified portfolio?",
    options: [
      { key: "A", text: "M2." },
      { key: "B", text: "Sharpe ratio." },
      { key: "C", text: "Jensen's alpha." },
    ], answer: "C",
  },
  {
    id: "m1-pm-48", topic: "Equity",
    prompt: "A function of the financial system is to:",
    options: [
      { key: "A", text: "prevent traders from speculating on information." },
      { key: "B", text: "equate aggregate savings with aggregate borrowings." },
      { key: "C", text: "restrict companies from spending money they do not have." },
    ], answer: "B",
  },
  {
    id: "m1-pm-49", topic: "Derivatives",
    prompt: "A protective put strategy consists of a:",
    options: [
      { key: "A", text: "long put option on an asset and a long position in a risk-free bond." },
      { key: "B", text: "long position in an underlying asset and a long put option on the asset." },
      { key: "C", text: "long call option on an asset and a short position in the underlying asset." },
    ], answer: "B",
  },
  {
    id: "m1-pm-50", topic: "Equity",
    prompt: "A stock dividend:",
    options: [
      { key: "A", text: "is relevant for valuation of a company." },
      { key: "B", text: "involves an increase in the number of shares outstanding." },
      { key: "C", text: "alters the shareholders' proportional ownership in the company." },
    ], answer: "B",
  },
  {
    id: "m1-pm-51", topic: "Portfolio Management",
    prompt: "Which of the following best describes a reason for having a written investment policy statement (IPS)?",
    options: [
      { key: "A", text: "To communicate a plan for achieving investment success." },
      { key: "B", text: "To keep track of the performance of a client's investment portfolio." },
      { key: "C", text: "As a fact-finding process for determining a client's risk tolerance." },
    ], answer: "A",
  },
  {
    id: "m1-pm-52", topic: "Fixed Income",
    prompt: "Which bond is most likely to exhibit a reduction in duration as time to maturity increases? A bond priced at:",
    options: [
      { key: "A", text: "par." },
      { key: "B", text: "a discount." },
      { key: "C", text: "a premium." },
    ], answer: "B",
  },
  {
    id: "m1-pm-53", topic: "Portfolio Management",
    prompt: "In the investment policy statement of a pension fund, a countrywide limit on the proportion of high-risk assets in long-term pension portfolios is most likely a:",
    options: [
      { key: "A", text: "time horizon constraint." },
      { key: "B", text: "liquidity constraint." },
      { key: "C", text: "legal and regulatory constraint." },
    ], answer: "C",
  },
  {
    id: "m1-pm-54", topic: "Fixed Income",
    prompt: "Relative to a non-recourse mortgage loan, on a recourse mortgage loan the:",
    options: [
      { key: "A", text: "lender can change the interest rate charged." },
      { key: "B", text: "borrower does not have a strategic default option." },
      { key: "C", text: "borrower is not liable for any shortfall between property sale proceeds and the loan amount." },
    ], answer: "B",
  },
  {
    id: "m1-pm-55", topic: "Alternative Investments",
    prompt: "The multiple of invested capital (MOIC) measure takes into account:",
    options: [
      { key: "A", text: "the realized value of an investment only." },
      { key: "B", text: "the residual value of an investment only." },
      { key: "C", text: "both the realized value of an investment and the residual asset value of an investment." },
    ], answer: "C",
  },
  {
    id: "m1-pm-56", topic: "Equity",
    prompt: "Investors in a closed-end mutual fund can liquidate their positions by selling the shares to:",
    options: [
      { key: "A", text: "the fund itself." },
      { key: "B", text: "other investors only." },
      { key: "C", text: "both the fund itself and other investors." },
    ], answer: "B",
  },
  {
    id: "m1-pm-57", topic: "Fixed Income",
    prompt: "Effective duration measures a bond's sensitivity to a:",
    options: [
      { key: "A", text: "flattening of the benchmark yield curve." },
      { key: "B", text: "steepening of the benchmark yield curve." },
      { key: "C", text: "parallel shift in the benchmark yield curve." },
    ], answer: "C",
  },
  {
    id: "m1-pm-58", topic: "Portfolio Management",
    prompt: "An example of nonsystematic risk is a(n):",
    options: [
      { key: "A", text: "failure of a drug trial." },
      { key: "B", text: "increase in the nominal rate of inflation." },
      { key: "C", text: "change in the central bank's interest rate policy." },
    ], answer: "A",
  },
  {
    id: "m1-pm-59", topic: "Portfolio Management",
    prompt: "Which of the following is best categorized as non-financial risk?",
    options: [
      { key: "A", text: "Market risk." },
      { key: "B", text: "Marketing risk." },
      { key: "C", text: "Accounting risk." },
    ], answer: "C",
  },
  {
    id: "m1-pm-60", topic: "Equity",
    prompt: "An investor buys a stock on margin, paying 60% of the initial $63.00 per share price as equity. All else being equal, if the investor receives a margin call at $33.60 per share, the maintenance margin on this trade is:",
    options: [
      { key: "A", text: "12.5%." },
      { key: "B", text: "25.0%." },
      { key: "C", text: "40.0%." },
    ], answer: "B",
  },
  {
    id: "m1-pm-61", topic: "Equity",
    prompt: "Which version of the dividend discount model (DDM) would most likely be appropriate for valuing a fairly young, publicly traded company?",
    options: [
      { key: "A", text: "A two-stage DDM." },
      { key: "B", text: "A three-stage DDM." },
      { key: "C", text: "The Gordon growth model." },
    ], answer: "B",
  },
  {
    id: "m1-pm-62", topic: "Equity",
    prompt: "An analyst gathers: Annual dividend per share D0 = $2.00, required payout ratio = 55%, required return = 8%. The intrinsic value per share using the Gordon growth model is closest to:",
    options: [
      { key: "A", text: "$50.63." },
      { key: "B", text: "$52.68." },
      { key: "C", text: "$64.82." },
    ], answer: "B",
  },
  {
    id: "m1-pm-63", topic: "Equity",
    prompt: "An analyst gathers data (in $ millions): Net income $15,500, Average total assets $11,500, Average shareholders' equity $7,000. If the dividend payout ratio is 45%, the sustainable growth rate is closest to:",
    options: [
      { key: "A", text: "7%." },
      { key: "B", text: "9%." },
      { key: "C", text: "11%." },
    ], answer: "C",
  },
  {
    id: "m1-pm-64", topic: "Portfolio Management",
    prompt: "Which of the following most likely accounts for most of the long-term changes in a portfolio value?",
    options: [
      { key: "A", text: "Beta." },
      { key: "B", text: "Alpha." },
      { key: "C", text: "Security selection." },
    ], answer: "A",
  },
  {
    id: "m1-pm-65", topic: "Alternative Investments",
    prompt: "An analyst gathers: Hedge fund AUM beginning of year $120 million, Ending AUM before fees $130 million, Management fee (on ending AUM) 2%, Incentive fee 20%, Hard hurdle rate 5%. If the incentive fee is calculated net of the management fee, the total fees earned by the fund manager are closest to:",
    options: [
      { key: "A", text: "$4.3 million." },
      { key: "B", text: "$4.8 million." },
      { key: "C", text: "$5.9 million." },
    ], answer: "A",
  },
  {
    id: "m1-pm-66", topic: "Fixed Income",
    prompt: "An analyst gathers: Annual modified duration 7.534, Flat price per 100 of par value 102.084, Accrued interest per 100 of par value 3.418. The bond's money duration per 100 of par value is closest to:",
    options: [
      { key: "A", text: "681." },
      { key: "B", text: "694." },
      { key: "C", text: "705." },
    ], answer: "C",
  },
  {
    id: "m1-pm-67", topic: "Fixed Income",
    prompt: "An analyst gathers forward rates: 1-year rate 2.30%, 1-year rate one year from now 2.50%, 1-year rate two years from now 2.90%. The 2-year implied spot rate is closest to:",
    options: [
      { key: "A", text: "2.56%." },
      { key: "B", text: "2.67%." },
      { key: "C", text: "2.82%." },
    ], answer: "A",
  },
  {
    id: "m1-pm-68", topic: "Fixed Income",
    prompt: "A US Treasury security originally issued with five years to maturity is a Treasury:",
    options: [
      { key: "A", text: "bill." },
      { key: "B", text: "note." },
      { key: "C", text: "bond." },
    ], answer: "B",
  },
  {
    id: "m1-pm-69", topic: "Portfolio Management",
    prompt: "In behavioral finance, which of the following statements best describes the bias of conservatism? Investors:",
    options: [
      { key: "A", text: "assess new information too quickly." },
      { key: "B", text: "focus on issues in isolation and respond to how they are framed." },
      { key: "C", text: "tend to be slow to react to new information and continue to maintain their prior views or forecasts." },
    ], answer: "C",
  },
  {
    id: "m1-pm-70", topic: "Fixed Income",
    prompt: "A bond currently trades at a price of 103.67 with a yield-to-maturity of 3.5%. If the price would be 104.50 at 3.4% YTM and 102.85 at 3.6% YTM, the approximate convexity is closest to:",
    options: [
      { key: "A", text: "0.048." },
      { key: "B", text: "0.096." },
      { key: "C", text: "48.230." },
    ], answer: "C",
  },
  {
    id: "m1-pm-71", topic: "Portfolio Management",
    prompt: "Which of the following return measures is most appropriate when comparing the annual returns of an asset over various long historical time periods?",
    options: [
      { key: "A", text: "The arithmetic mean of real returns." },
      { key: "B", text: "The geometric mean of real returns." },
      { key: "C", text: "The arithmetic mean of nominal returns." },
    ], answer: "B",
  },
  {
    id: "m1-pm-72", topic: "Derivatives",
    prompt: "Using put-call parity, if the price of a stock equals the current spot price, the price of an at-the-money put option will most likely be:",
    options: [
      { key: "A", text: "lower than the price of the at-the-money call option." },
      { key: "B", text: "equal to the price of the at-the-money call option." },
      { key: "C", text: "higher than the price of the at-the-money call option." },
    ], answer: "B",
  },
  {
    id: "m1-pm-73", topic: "Alternative Investments",
    prompt: "Regarding hedge fund fee calculations, the high-water mark provision:",
    options: [
      { key: "A", text: "represents the exact return target required." },
      { key: "B", text: "protects the client from paying twice for the same performance." },
      { key: "C", text: "is the rate of return that the general partner must exceed to earn a performance fee." },
    ], answer: "B",
  },
  {
    id: "m1-pm-74", topic: "Equity",
    prompt: "An analyst gathers: Stock A beginning price $30, ending price $45, shares outstanding 1,000; Stock B beginning price $50, ending price $60, shares outstanding 2,000. An equal-weighted index started at 100. If not rebalanced during the year, the index value at the end of the year is closest to:",
    options: [
      { key: "A", text: "109.2." },
      { key: "B", text: "111.7." },
      { key: "C", text: "117.7." },
    ], answer: "B",
  },
  {
    id: "m1-pm-75", topic: "Derivatives",
    prompt: "The price of a futures contract will be higher than the price of a forward contract when the correlation between futures prices and interest rates is:",
    options: [
      { key: "A", text: "negative." },
      { key: "B", text: "zero." },
      { key: "C", text: "positive." },
    ], answer: "C",
  },
  {
    id: "m1-pm-76", topic: "Fixed Income",
    prompt: "In the priority of claims, the class of corporate debt that has the lowest priority of payments in the event of default is most likely:",
    options: [
      { key: "A", text: "second lien debt." },
      { key: "B", text: "subordinated debt." },
      { key: "C", text: "junior subordinated debt." },
    ], answer: "C",
  },
  {
    id: "m1-pm-77", topic: "Portfolio Management",
    prompt: "The returns of Asset 1 and Asset 2 are perfectly positively correlated and have the same standard deviation. The covariance between the returns of the assets is equal to the:",
    options: [
      { key: "A", text: "variance of Asset 1's returns." },
      { key: "B", text: "standard deviation of Asset 1's returns." },
      { key: "C", text: "variance of Asset 2's returns divided by the variance of Asset 1's returns." },
    ], answer: "A",
  },
  {
    id: "m1-pm-78", topic: "Portfolio Management",
    prompt: "Insurance companies most likely:",
    options: [
      { key: "A", text: "target higher returns in their general account than in their surplus account." },
      { key: "B", text: "accept investments with lower returns in their general account." },
      { key: "C", text: "hold primarily short-duration assets to match their long-duration liabilities." },
    ], answer: "B",
  },
  {
    id: "m1-pm-79", topic: "Derivatives",
    prompt: "If the expected forward rate curve shifts downward after the inception of a swap, the mark-to-market value of the swap for the fixed-rate payer will most likely:",
    options: [
      { key: "A", text: "decrease." },
      { key: "B", text: "remain the same." },
      { key: "C", text: "increase." },
    ], answer: "A",
  },
  {
    id: "m1-pm-80", topic: "Equity",
    prompt: "Short sellers most likely:",
    options: [
      { key: "A", text: "pay a short rebate to security lenders." },
      { key: "B", text: "receive cash collateral from security lenders." },
      { key: "C", text: "make payments-in-lieu of dividends to security lenders." },
    ], answer: "C",
  },
  {
    id: "m1-pm-81", topic: "Alternative Investments",
    prompt: "A hedge fund has: Initial investment $100 million, Year 1 profit $25 million, Year 2 loss $5 million. Incentive fee is 20% with a clawback provision. The total incentive fee (in $ millions) for Years 1 and 2 is:",
    options: [
      { key: "A", text: "0." },
      { key: "B", text: "3." },
      { key: "C", text: "5." },
    ], answer: "B",
  },
  {
    id: "m1-pm-82", topic: "Corporate Issuers",
    prompt: "Statutory voting means that shareholders:",
    options: [
      { key: "A", text: "vote by proxy." },
      { key: "B", text: "have one vote per share." },
      { key: "C", text: "with a small number of shares are in a better position than in the case of cumulative voting." },
    ], answer: "B",
  },
  {
    id: "m1-pm-83", topic: "Derivatives",
    prompt: "An investor purchases a European put option with a strike price of $25 on a stock currently trading at $10. If the price of the underlying at expiration is $10, the value of the option at expiration is equal to:",
    options: [
      { key: "A", text: "$0." },
      { key: "B", text: "$10." },
      { key: "C", text: "$15." },
    ], answer: "C",
  },
  {
    id: "m1-pm-84", topic: "Alternative Investments",
    prompt: "Which of the following statements about direct ownership of real estate is most accurate?",
    options: [
      { key: "A", text: "Local real estate market expertise is important for success." },
      { key: "B", text: "Investors have no control over the tenant selection process." },
      { key: "C", text: "Investors cannot use non-cash property depreciation expenses to reduce taxable income." },
    ], answer: "A",
  },
  {
    id: "m1-pm-85", topic: "Equity",
    prompt: "For which of the following industries are economic influences most important?",
    options: [
      { key: "A", text: "Utilities." },
      { key: "B", text: "Transportation." },
      { key: "C", text: "Pharmaceuticals." },
    ], answer: "B",
  },
  {
    id: "m1-pm-86", topic: "Equity",
    prompt: "If an investor wants to protect a short position from adverse price movements while retaining the opportunity for gains in the future, the investor should most likely use a:",
    options: [
      { key: "A", text: "stop order." },
      { key: "B", text: "limit order." },
      { key: "C", text: "market order." },
    ], answer: "A",
  },
  {
    id: "m1-pm-87", topic: "Portfolio Management",
    prompt: "When making investment decisions, which of the following best describes a way to correct a behavioral bias caused by a cognitive error?",
    options: [
      { key: "A", text: "Obtain better investment information." },
      { key: "B", text: "Act on intuition when making investments." },
      { key: "C", text: "Evaluate investments based on past gains and losses." },
    ], answer: "A",
  },
  {
    id: "m1-pm-88", topic: "Derivatives",
    prompt: "At maturity, the buyer of an over-the-counter (OTC) financial instrument faces counterparty credit risk of the seller in:",
    options: [
      { key: "A", text: "a profitable forward position only." },
      { key: "B", text: "an in-the-money long call option position only." },
      { key: "C", text: "both a profitable long forward position and an in-the-money long call option position." },
    ], answer: "C",
  },
  {
    id: "m1-pm-89", topic: "Equity",
    prompt: "A limit order book shows various bid and ask prices for a stock. An investor receives an order to sell 9,000 shares at market. Based on the order book, the average price at which the trades will be executed is closest to:",
    options: [
      { key: "A", text: "CHF 42.50." },
      { key: "B", text: "CHF 42.52." },
      { key: "C", text: "CHF 42.53." },
    ], answer: "C",
  },
  {
    id: "m1-pm-90", topic: "Equity",
    prompt: "A US investor purchases an American depositary receipt (ADR) of a company based in Japan. The total return of the company's stock in Japan is 3% and the Japanese yen appreciates by approximately 3% against the US dollar. The investor's total return is closest to:",
    options: [
      { key: "A", text: "0%." },
      { key: "B", text: "4%." },
      { key: "C", text: "6%." },
    ], answer: "C",
  },
];

// ─── Session questions map ─────────────────────────────────────────────────────
export const sessionQuestions: Record<string, Question[]> = {
  "m1-am": m1AmQuestions,
  "m1-pm": m1PmQuestions,
};

// Fallback for sessions not yet populated with real questions
export const sampleQuestions: Question[] = m1AmQuestions;

export const subjectBreakdown = [
  { subject: "Ethics", score: 82, total: 100 },
  { subject: "Quant Methods", score: 68, total: 100 },
  { subject: "Economics", score: 74, total: 100 },
  { subject: "FRA", score: 71, total: 100 },
  { subject: "Corporate Issuers", score: 80, total: 100 },
  { subject: "Equity", score: 65, total: 100 },
  { subject: "Fixed Income", score: 77, total: 100 },
  { subject: "Derivatives", score: 60, total: 100 },
  { subject: "Alternatives", score: 73, total: 100 },
  { subject: "Portfolio Mgmt", score: 79, total: 100 },
];

export const progressTrend = [
  { mock: "M1", score: 62 },
  { mock: "M2", score: 67 },
  { mock: "M3", score: 71 },
  { mock: "M4", score: 70 },
  { mock: "M5", score: 76 },
  { mock: "M6", score: 81 },
];
