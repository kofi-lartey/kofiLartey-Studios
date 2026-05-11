import React from 'react';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#050505] font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />
      
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </header>

          <div className="prose prose-invert prose-sm max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Account information (name, email, password)</li>
                <li>Profile information (photography specialty, studio location)</li>
                <li>Uploaded content (photos, galleries, client data)</li>
                <li>Communication data (support requests, feedback)</li>
                <li>Usage data (feature usage, session information)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related communications</li>
                <li>Send technical updates and security notifications</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Improve our services and develop new features</li>
                <li>Personalize your experience</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">3. Legal Basis for Processing</h2>
              <p className="text-gray-400 leading-relaxed">
                If you are located in the European Economic Area, we process your personal data based on:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 mt-4">
                <li>Your consent for specific purposes</li>
                <li>Necessity to perform our contract with you</li>
                <li>Our legitimate business interests</li>
                <li>Compliance with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">4. Cookies and Tracking</h2>
              <p className="text-gray-400 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookies through your browser settings, though disabling them may affect service functionality.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Service providers who assist in operating our platform</li>
                <li>Professional advisors (lawyers, accountants) when necessary</li>
                <li>Law enforcement when required by law or to protect rights</li>
                <li>Business partners for joint offerings (with your consent)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">6. Data Security</h2>
              <p className="text-gray-400 leading-relaxed">
                We implement industry-standard security measures including encryption in transit and at rest, regular security audits, and access controls. However, no method is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">7. Your Rights</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Delete your personal data</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                Contact us at <a href="mailto:kofilartey12@gmail.com" className="text-indigo-400 hover:text-indigo-300">kofilartey12@gmail.com</a> to exercise these rights.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">8. Data Retention</h2>
              <p className="text-gray-400 leading-relaxed">
                We retain information for as long as necessary to provide our services and for legitimate business purposes, including compliance with legal obligations, dispute resolution, and enforcing agreements.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">9. International Transfer</h2>
              <p className="text-gray-400 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-400 leading-relaxed">
                We may update this Privacy Policy. We will notify you of material changes by posting the new policy on this page and updating the effective date.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">11. Contact Us</h2>
              <p className="text-gray-400 leading-relaxed">
                If you have questions about this Privacy Policy, contact us at <a href="mailto:kofilartey12@gmail.com" className="text-indigo-400 hover:text-indigo-300">kofilartey12@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;