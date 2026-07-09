import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_CATEGORIES: { title: string; items: FAQItem[] }[] = [
  {
    title: 'About DARCO Academy',
    items: [
      {
        question: 'What is DARCO Academy?',
        answer:
          'DARCO Academy is an online career training platform built for people who want to break into real estate, property management, apartment leasing, and skilled trades. Our courses are designed to be practical, affordable, and accessible — no prior experience required.',
      },
      {
        question: 'Who are the courses designed for?',
        answer:
          'Our courses are for anyone starting a new career or looking to formalize skills they already have. Whether you are a recent graduate, changing careers, or simply want to become more competitive in the job market, DARCO Academy is built for you.',
      },
      {
        question: 'Is DARCO Academy accredited?',
        answer:
          'DARCO Academy provides career preparation and skills training. Our courses are educational in nature and are designed to help you prepare for licensing exams and professional roles. Please verify specific licensing and accreditation requirements with your state or local authority.',
      },
    ],
  },
  {
    title: 'Courses and Content',
    items: [
      {
        question: 'What courses are available?',
        answer:
          'We currently offer career tracks in Real Estate Foundation, Residential Agent, Property Management, Apartment Leasing, Electrician Fundamentals, and Construction Painting. Each track includes structured modules, quizzes, and a glossary to reinforce learning.',
      },
      {
        question: 'Can I preview a course before purchasing?',
        answer:
          'Yes. Every course includes a free first module so you can experience the content and teaching style before committing. No credit card is required to access the free module.',
      },
      {
        question: 'How long does each course take to complete?',
        answer:
          'Course length varies by track. Most career tracks are designed to be completed in 4 to 8 weeks at a comfortable pace of a few hours per week. You can move faster or slower depending on your schedule — there are no deadlines.',
      },
      {
        question: 'Do courses expire after purchase?',
        answer:
          'No. Once you purchase a course, you have lifetime access to all the content, including any future updates we make to the material.',
      },
      {
        question: 'Are the courses updated regularly?',
        answer:
          'Yes. We review and update course content on an ongoing basis to reflect changes in licensing requirements, industry practices, and regulations. All updates are included at no additional cost.',
      },
    ],
  },
  {
    title: 'Pricing and Payment',
    items: [
      {
        question: 'How much do the courses cost?',
        answer:
          'Pricing varies by course. You can view the current price for each course on its detail page. We also offer promotional codes from time to time — check our website or contact us to ask about current offers.',
      },
      {
        question: 'Do you offer refunds?',
        answer:
          'We offer a 7-day refund on all courses if you are not satisfied with your purchase. Contact us at info@darcocenter.org within 7 days of your purchase date and we will process your refund.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) processed securely through Stripe. We do not store your card information.',
      },
      {
        question: 'Do you offer group or employer pricing?',
        answer:
          'Yes. If you are looking to enroll a team or group of employees, contact us at info@darcocenter.org and we can discuss group pricing options.',
      },
    ],
  },
  {
    title: 'Certificates and Licensing',
    items: [
      {
        question: 'Will I receive a certificate after completing a course?',
        answer:
          'Yes. Upon completing all modules and passing the required assessments, you will receive a DARCO Academy certificate of completion. This certificate demonstrates your commitment to professional development.',
      },
      {
        question: 'Does completing a DARCO Academy course guarantee a license?',
        answer:
          'No. Our courses are designed to help you prepare for licensing exams and professional roles, but licensing is issued by state and local authorities and requires you to meet their specific requirements. Always verify current licensing requirements with your state or local authority.',
      },
      {
        question: 'Does completing a DARCO Academy course guarantee employment?',
        answer:
          'No. DARCO Academy provides career preparation training and does not guarantee employment outcomes. Our goal is to make you job-ready and competitive in your chosen field.',
      },
    ],
  },
  {
    title: 'Technical and Account',
    items: [
      {
        question: 'How do I create an account?',
        answer:
          'Click "Begin Your Path" on the homepage or "Create Account" in the navigation. You will need to provide your name, email address, and a password. Account creation is free.',
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer:
          'On the login page, click "Forgot password?" and enter your email address. We will send you a password reset link. If you do not receive it within a few minutes, check your spam folder or contact us at info@darcocenter.org.',
      },
      {
        question: 'Can I access courses on my phone or tablet?',
        answer:
          'Yes. DARCO Academy is fully responsive and works on desktop, tablet, and mobile devices. You can study from anywhere with an internet connection.',
      },
      {
        question: 'I am having a technical issue. How do I get help?',
        answer:
          'Contact us at info@darcocenter.org or call (818) 687-0188 and we will help you resolve the issue as quickly as possible.',
      },
    ],
  },
]

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#EDE8E2] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-body font-semibold text-sm text-[#1A1A18] leading-snug">
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[#C9A84C] transition-transform mt-0.5 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-5 pr-8">
          <p className="font-body text-sm text-[#5A4A3A] leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      {/* Hero */}
      <div className="bg-[#1E2A38] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-[#BCCAD8] text-lg">
            Everything you need to know about DARCO Academy and our courses.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-10">
        {FAQ_CATEGORIES.map(category => (
          <div key={category.title} className="bg-white rounded-2xl border border-[#DDD5C8] shadow-sm overflow-hidden">
            <div className="bg-[#1E2A38] px-6 py-4">
              <h2 className="font-display font-bold text-base text-white">{category.title}</h2>
            </div>
            <div className="px-6">
              {category.items.map(item => (
                <FAQAccordion key={item.question} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions CTA */}
        <div className="bg-[#1E2A38] rounded-2xl p-8 text-center">
          <h3 className="font-display font-bold text-xl text-white mb-2">Still have questions?</h3>
          <p className="font-body text-[#BCCAD8] text-sm mb-6">
            We are happy to help. Reach out and we will get back to you within one business day.
          </p>
          <Link
            to="/contact"
            className="inline-block font-body font-semibold text-sm px-6 py-3 rounded-lg text-[#1E2A38] bg-[#C9A84C] hover:brightness-110 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
