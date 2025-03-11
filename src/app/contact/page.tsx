import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | ModernShop',
  description: 'Get in touch with our team for any questions, support, or feedback',
};

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 dark:opacity-20"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              We&apos;d love to hear from you. Whether you have a question about our products,
              need help with an order, or just want to say hello.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send us a message</h2>
                <form>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="subject">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="message">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Tell us how we can help you..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Have questions or need assistance? Reach out to us using any of the methods below,
                and our dedicated team will get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <PhoneIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Mon-Fri: 9AM - 6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <MailIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">support@modernshop.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <MapPinIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Office</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 E-Commerce Street</p>
                    <p className="text-gray-600 dark:text-gray-400">San Francisco, CA 94107</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 9AM - 6PM EST</p>
                    <p className="text-gray-600 dark:text-gray-400">Saturday: 10AM - 4PM EST</p>
                    <p className="text-gray-600 dark:text-gray-400">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">Find Us</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-[400px] w-full max-w-5xl mx-auto">
            {/* Placeholder for map - in a real app, you would embed a Google Map here */}
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center p-6">
                <MapPinIcon className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">ModernShop Headquarters</h3>
                <p className="text-gray-600 dark:text-gray-400">123 E-Commerce Street, San Francisco, CA 94107</p>
                <button className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How long does shipping take?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Standard shipping typically takes 3-5 business days within the continental US.
                  Express shipping options are available at checkout for faster delivery.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">What is your return policy?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer a 30-day return policy for most items. Products must be in their original condition
                  with all tags and packaging intact. Some exclusions may apply.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Do you ship internationally?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, we ship to most countries worldwide. International shipping rates and delivery times
                  vary by location. You can view estimated shipping costs at checkout.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-gray-400">
                Have more questions? Contact our support team or visit our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Help Center
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 