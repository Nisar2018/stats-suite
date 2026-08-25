const pageContents = {
  about: {
    title: 'About Us',
    subtitle: 'Learn more about StatsSuite and our mission.',
    sections: [
      {
        heading: 'Our Mission',
        body: 'StatsSuite is an interactive statistics learning platform created to help students understand measures of central tendency. We believe that learning statistics should be visual, hands-on, and accessible to everyone.',
      },
      {
        heading: 'What We Offer',
        body: 'Our platform provides comprehensive coverage of mean, mode, and median calculations — from basic ungrouped data to advanced frequency table formulas. Every topic includes clear formulas, editable input fields, and detailed step-by-step calculation breakdowns.',
      },
      {
        heading: 'Who Is It For?',
        body: 'StatsSuite is designed for high school and college students, educators, and anyone looking to strengthen their understanding of descriptive statistics and central tendency measurements.',
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'We would love to hear from you.',
    sections: [
      {
        heading: 'Get in Touch',
        body: 'Have questions, feedback, or suggestions? Reach out to us and we will get back to you as soon as possible.',
      },
      {
        heading: 'Email',
        body: 'support@statssuite.com',
      },
      {
        heading: 'Office Hours',
        body: 'Monday – Friday, 9:00 AM – 5:00 PM (local time). We aim to respond to all inquiries within 48 hours.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we handle your information.',
    sections: [
      {
        heading: 'Information Collection',
        body: 'StatsSuite is an educational tool that runs entirely in your browser. We do not collect, store, or transmit any personal data you enter into the calculators. All calculations are performed locally on your device.',
      },
      {
        heading: 'Cookies',
        body: 'We may use essential cookies to improve your browsing experience. No tracking or advertising cookies are used.',
      },
      {
        heading: 'Third-Party Services',
        body: 'We do not share your data with third parties. Any analytics, if used in the future, will be anonymized and disclosed in an updated version of this policy.',
      },
      {
        heading: 'Updates',
        body: 'This privacy policy may be updated periodically. Continued use of the platform constitutes acceptance of any changes.',
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    subtitle: 'Please read these terms carefully.',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By accessing and using StatsSuite, you agree to be bound by these Terms of Use. If you do not agree, please do not use the platform.',
      },
      {
        heading: 'Educational Purpose',
        body: 'StatsSuite is provided for educational purposes only. While we strive for accuracy, results should be verified independently for academic or professional use.',
      },
      {
        heading: 'Intellectual Property',
        body: 'All content, design, and code on StatsSuite are the property of StatsSuite. You may not reproduce, distribute, or create derivative works without permission.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'StatsSuite is provided "as is" without warranties. We are not liable for any damages arising from the use of this platform.',
      },
    ],
  },
};

export function StaticPage({ pageId }) {
  const content = pageContents[pageId];
  if (!content) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-3xl font-bold text-blue-900 md:text-4xl">{content.title}</h1>
      <p className="mt-2 text-lg text-academic-600">{content.subtitle}</p>

      <div className="mt-8 space-y-8">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold text-blue-900">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-academic-700">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
