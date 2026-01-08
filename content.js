import { Logo } from "@/once-ui/components";

const person = {
  firstName: "Prabhakar",
  lastName: "",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Multimedia Journalist",
  avatar: "/images/avatar.png",
  email: "prabhakarhome1993@gmail.com",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["Hindi", "English"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about social justice, corruption, and share thoughts
      on the intersection of technology and society.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/prabhakar-13580b177/",
  },
  {
    name: "Twitter",
    icon: "x",
    link: "https://x.com/PrabhakarHrC",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>I'm Prabhakar, a Multimedia Journalist.</>,
  // featured: {
  //   display: true,
  //   title: (
  //     <>
  //       Recent project: <strong className="ml-4">Once UI</strong>
  //     </>
  //   ),
  //   href: "/work/building-once-ui-a-customizable-design-system",
  // },
  subline: (
    <>
      Bridging the Gap Between Ground Realities and National Discourse by using
      Journalism as a Tool for Justice—Covering Protests, Elections, and the
      Stories That Shape Society.
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Around 3 years of journalistic experience working with different
        organizations and domains. I do stories to make a difference and use
        journalism for the public good..
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Tree Initiatives Society",
        timeframe: "Jan 2025 - Present",
        role: "President",
        achievements: [
          <>
            Founded and led Tree Initiatives Society, a registered
            education-focused organization committed to societal upliftment
            through grassroots mobilization, awareness campaigns, and inclusive
            development..
          </>,
          <>
            Spearheaded key initiatives including health camps, educational
            outreach programs, and community engagement drives, successfully
            mobilizing volunteers and resources to support underprivileged
            populations.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          // {
          //   src: "/images/projects/project-01/cover-01.jpg",
          //   alt: "Once UI Project",
          //   width: 16,
          //   height: 9,
          // },
        ],
      },
      {
        company: "Jan Suraj",
        timeframe: "Oct 2023 - Sep 2024",
        role: "Fellow",
        achievements: [
          <>
            Conducted grassroots-level data collection to identify local
            socio-economic issues, enabling evidence-based planning and targeted
            intervention strategies.
          </>,
          <>
            Led community mobilization campaigns, engaging diverse stakeholders
            to raise awareness, build participation, and drive collective action
            around public welfare initiatives.
          </>,
        ],
        images: [],
      },
      {
        company: "India News (ITV Network)",
        timeframe: "Oct 2022 - Nov 2022",
        role: "Researcher ",
        achievements: [
          <>
            Conducted political and social research at India News, supporting
            news reporting with insights and writing research-based articles on
            current affairs to enhance content accuracy.
          </>,
        ],
        images: [],
      },
      {
        company: "Impractical Media",
        timeframe: "Jan 2020 - Oct 2022",
        role: "Chief Editor",
        achievements: [
          <>
            Reported on major national events including the UP Assembly
            elections and Farmer’s Protest; contributed background research,
            scripts, photo stories, and in-depth coverage of politically
            sensitive issues like Delhi violence.
          </>,
          <>
            Edited and created multimedia content—including fact-check posts,
            social media graphics, and website articles—while actively
            participating in editorial meetings to pitch and refine story ideas.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
    institutions: [
      {
        name: "Ph.D Research Scholar - Hindi (Pursuing)",
        description: <>Awadhesh Pratap Singh University, Madhya Pradesh.</>,
      },
      {
        name: "PG Diploma in Radio & Television Journalism (2019-2020)",
        description: <>Indian Institute of Mass Communication, New Delhi.</>,
      },
      {
        name: "Master of Arts in Hindi (2016-2018)",
        description: <>University of Delhi.</>,
      },
      {
        name: "Bachelor of Arts in Hindi (2013-2016)",
        description: <>University of Delhi.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Skills",
    skills: [
      {
        title: "Investigative Journalism & Fact-Checking Expertise",
        description: (
          <>
            Skilled in reporting, proofreading, editorial writing, and content
            research with hands-on experience using advanced verification tools
            such as Bot Sentinel, FotoForensics, InVid, Wayback Machine, YouTube
            Data Viewer, WHOIS Lookup, and Yandex. Adept at identifying
            misinformation and delivering accurate, responsible journalism.
          </>
        ),
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/factCheck.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/reporting.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Multimedia Production & Digital Storytelling",
        description: (
          <>
            Proficient in Hindi typing, video editing with Adobe Premiere Pro,
            and creating compelling infographics. Well-versed in DSLR
            photography and mobile journalism techniques, enabling the
            production of high-impact visual content tailored for digital media
            platforms.
          </>
        ),
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/mobileProduction.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
