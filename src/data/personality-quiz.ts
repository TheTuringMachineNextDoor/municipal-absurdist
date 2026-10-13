// The Personality Quiz: "Which municipal department are you?"
//
// `departments` are the possible results. `questions` are asked in
// order; each answer names the department it counts toward. The reader
// gets whichever department their answers named most often.
//
// To edit: change any text freely. If you add a question, give every
// answer a `for` that matches a department's id. Try to keep each
// department appearing about equally often, or one will win too easily.

export interface Department {
  id: string;
  name: string;
  /** A short motto shown under the name. */
  motto: string;
  description: string;
  /** A file from public/illustrations. */
  image: string;
}

export const departments: Department[] = [
  {
    id: 'works',
    name: 'The Department of Public Works',
    motto: 'We will get to it.',
    description:
      'You are practical, dependable, and four to six weeks away. People rely on you entirely and would like to know when.',
    image: 'pantagruel-02.webp',
  },
  {
    id: 'records',
    name: 'The Office of Public Records',
    motto: 'It is in here somewhere.',
    description:
      'You forget nothing and can find none of it. You have kept every receipt since 1998 and regard this as a personality.',
    image: 'pantagruel-11.webp',
  },
  {
    id: 'parks',
    name: 'The Department of Parks',
    motto: 'Please keep off the enthusiasm.',
    description:
      'You are cheerful, outdoorsy, and closed for the season. Everyone likes you, which you have noticed and budgeted for.',
    image: 'pantagruel-09.webp',
  },
  {
    id: 'complaints',
    name: 'The Department of Complaints',
    motto: 'At present, full.',
    description:
      'You notice everything that is wrong and have a form for most of it. You are usually right, which has not helped.',
    image: 'pantagruel-10.webp',
  },
  {
    id: 'zoning',
    name: 'The Zoning Board',
    motto: 'No.',
    description:
      'You have standards, a ruler, and no intention of moving either. Nothing is built on your watch, including consensus.',
    image: 'pantagruel-03.webp',
  },
  {
    id: 'mayor',
    name: 'The Office of the Mayor',
    motto: 'A triumph, and yours.',
    description:
      'You are confident, visible, and always standing near whatever went well. You have never left a room without cutting a ribbon in it.',
    image: 'pantagruel-12.webp',
  },
];

export interface Question {
  text: string;
  answers: { text: string; for: string }[];
}

export const questions: Question[] = [
  {
    text: 'A pothole appears outside your home. You:',
    answers: [
      { text: 'Put a cone in it and promise to return.', for: 'works' },
      { text: 'Photograph it, date it, and file it under P.', for: 'records' },
      { text: 'Plant something in it.', for: 'parks' },
      { text: 'Report it, then report how long the report is taking.', for: 'complaints' },
    ],
  },
  {
    text: 'Your ideal weekend is:',
    answers: [
      { text: 'Exactly like the last one. That is what makes it ideal.', for: 'zoning' },
      { text: 'Attended by photographers.', for: 'mayor' },
      { text: 'Scheduled for the following weekend.', for: 'works' },
      { text: 'Spent reorganising something that was already organised.', for: 'records' },
    ],
  },
  {
    text: 'A stranger asks you for directions. You:',
    answers: [
      { text: 'Walk them there, pointing out the trees.', for: 'parks' },
      { text: 'Tell them, and add what is wrong with the place.', for: 'complaints' },
      { text: 'Explain that they cannot get there from here, nor should they.', for: 'zoning' },
      { text: 'Assure them they have already arrived, thanks to you.', for: 'mayor' },
    ],
  },
  {
    text: 'Your desk is best described as:',
    answers: [
      { text: 'Under repair.', for: 'works' },
      { text: 'A complete record of everything that has ever been on it.', for: 'records' },
      { text: 'Mostly a plant.', for: 'parks' },
      { text: 'Unacceptable, and you have said so.', for: 'complaints' },
    ],
  },
  {
    text: 'Someone proposes a new idea at a meeting. You say:',
    answers: [
      { text: '“No.”', for: 'zoning' },
      { text: '“I have been saying this for years.”', for: 'mayor' },
      { text: '“We can start in the spring.”', for: 'works' },
      { text: '“We tried that in 2011. I have the minutes.”', for: 'records' },
    ],
  },
  {
    text: 'At a party you are usually found:',
    answers: [
      { text: 'Outside.', for: 'parks' },
      { text: 'Explaining the problem with the music.', for: 'complaints' },
      { text: 'Asking whether this many people is permitted.', for: 'zoning' },
      { text: 'Giving a short speech nobody requested.', for: 'mayor' },
    ],
  },
  {
    text: 'Your approach to a deadline is:',
    answers: [
      { text: 'To regard it as a beginning.', for: 'works' },
      { text: 'To note it carefully, in three places.', for: 'records' },
      { text: 'To go for a walk and see how you feel.', for: 'parks' },
      { text: 'To object to it in writing, on time.', for: 'complaints' },
    ],
  },
  {
    text: 'Choose a motto:',
    answers: [
      { text: '“Not here.”', for: 'zoning' },
      { text: '“You are welcome.”', for: 'mayor' },
      { text: '“Bear with us.”', for: 'works' },
      { text: '“Keep everything.”', for: 'records' },
    ],
  },
  {
    text: 'A neighbour paints their house purple. You:',
    answers: [
      { text: 'Bring them a hydrangea to match.', for: 'parks' },
      { text: 'Draft a letter.', for: 'complaints' },
      { text: 'Measure it.', for: 'zoning' },
      { text: 'Announce a purple initiative.', for: 'mayor' },
    ],
  },
  {
    text: 'What do you do with an instruction manual?',
    answers: [
      { text: 'Begin without it and consult it afterwards, as evidence.', for: 'works' },
      { text: 'Keep it, along with the box, and the previous box.', for: 'records' },
      { text: 'Leave it on a bench for someone who needs it.', for: 'parks' },
      { text: 'Read it in full and list its errors.', for: 'complaints' },
    ],
  },
  {
    text: 'The city gives you one million dollars. You:',
    answers: [
      { text: 'Decline, on procedural grounds.', for: 'zoning' },
      { text: 'Build something with your name on it.', for: 'mayor' },
      { text: 'Spend it on the first half of a bridge.', for: 'works' },
      { text: 'Ask for a receipt.', for: 'records' },
    ],
  },
  {
    text: 'How would your friends describe you?',
    answers: [
      { text: 'Pleasant, and often muddy.', for: 'parks' },
      { text: 'Right, unfortunately.', for: 'complaints' },
      { text: 'Consistent.', for: 'zoning' },
      { text: 'Exactly as you have asked them to.', for: 'mayor' },
    ],
  },
];
