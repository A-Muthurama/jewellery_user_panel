import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="legal-page">
            <div className="container section">
                <Link to="/" className="back-link">
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <h1 className="page-title">Privacy Policy</h1>

                <div className="legal-content">
                    <p className="intro-text">
                        Last updated: January 2026
                    </p>
                    <p>
                        Welcome to Project J (“we”, “our”, or “us”). We operate an online platform dedicated exclusively to gold jewellery offers and discounts, where registered jewellery stores can list their deals and users can discover them. Your privacy is important to us, and this Privacy Statement explains how we collect, use, disclose, and protect your information in accordance with applicable laws in India, including the Information Technology Act, 2000 and related rules.
                    </p>

                    <hr className="divider" />

                    <h3>1. Information We Collect</h3>
                    <p>We may collect the following categories of information:</p>

                    <h4>a) Information from Users</h4>
                    <ul>
                        <li>Name, email address, phone number (if provided)</li>
                        <li>Preferences related to offers, locations, or jewellery types</li>
                        <li>Any information you provide when contacting us or subscribing to notifications</li>
                    </ul>

                    <h4>b) Information from Jewellery Stores (Merchants)</h4>
                    <ul>
                        <li>Business name, contact person name</li>
                        <li>Business email address and phone number</li>
                        <li>Store address and location</li>
                        <li>GST or business registration details (if required)</li>
                        <li>Offer details, pricing, and promotional content</li>
                    </ul>

                    <h4>c) Automatically Collected Information</h4>
                    <ul>
                        <li>IP address, browser type, device information</li>
                        <li>Pages visited, time spent, and interaction data</li>
                        <li>Cookies and similar tracking technologies</li>
                    </ul>

                    <hr className="divider" />

                    <h3>2. How We Use Your Information</h3>
                    <p>We use the collected information to:</p>
                    <ul>
                        <li>Operate and manage the gold offers platform</li>
                        <li>Allow jewellery stores to register and publish offers</li>
                        <li>Display relevant gold jewellery deals to users</li>
                        <li>Communicate with users and registered stores</li>
                        <li>Improve website functionality and user experience</li>
                        <li>Prevent fraud, misuse, and unauthorized access</li>
                        <li>Comply with legal and regulatory obligations</li>
                    </ul>

                    <hr className="divider" />

                    <h3>3. Cookies and Tracking Technologies</h3>
                    <p>We use cookies to:</p>
                    <ul>
                        <li>Remember user preferences</li>
                        <li>Analyze traffic and platform performance</li>
                        <li>Improve content relevance</li>
                    </ul>
                    <p>
                        You may choose to disable cookies through your browser settings; however, some features of the website may not function properly.
                    </p>

                    <hr className="divider" />

                    <h3>4. Sharing of Information</h3>
                    <p>We do not sell personal data. Information may be shared only in the following circumstances:</p>
                    <ul>
                        <li>With service providers who assist in hosting, analytics, or platform operations</li>
                        <li>When required by law, regulation, or legal process</li>
                        <li>To protect the rights, safety, or property of users, merchants, or our platform</li>
                        <li>In the event of a merger, acquisition, or transfer of business assets</li>
                    </ul>
                    <p>Offer details posted by jewellery stores are publicly visible on the platform.</p>

                    <hr className="divider" />

                    <h3>5. Third-Party Links</h3>
                    <p>
                        Our platform may contain links to third-party websites, including jewellery store websites. We are not responsible for the privacy practices or content of such third parties. Users are encouraged to review their privacy policies separately.
                    </p>

                    <hr className="divider" />

                    <h3>6. Data Security</h3>
                    <p>
                        We implement reasonable security measures to protect personal and business information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
                    </p>

                    <hr className="divider" />

                    <h3>7. Data Retention</h3>
                    <p>
                        We retain personal and business information only for as long as necessary to fulfill the purposes outlined in this Privacy Statement or as required by applicable laws.
                    </p>

                    <hr className="divider" />

                    <h3>8. Your Rights</h3>
                    <p>Subject to applicable Indian laws, you may:</p>
                    <ul>
                        <li>Request access to your personal information</li>
                        <li>Request correction or deletion of your data</li>
                        <li>Withdraw consent for marketing communications</li>
                    </ul>
                    <p>Requests can be made using the contact details provided below.</p>

                    <hr className="divider" />

                    <h3>9. Children’s Privacy</h3>
                    <p>
                        This platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors.
                    </p>

                    <hr className="divider" />

                    <h3>10. Changes to This Privacy Statement</h3>
                    <p>
                        We may update this Privacy Statement from time to time. Any changes will be posted on this page with an updated “Last updated” date.
                    </p>

                    <hr className="divider" />

                    <h3>11. Contact Information</h3>
                    <p>
                        If you have any questions or concerns about this Privacy Statement or our data practices, please contact us at:
                    </p>
                    <div className="contact-info">
                        <div className="contact-item">
                            <strong>EMAIL:</strong> <a href="mailto:contact@projectj.com">contact@projectj.com</a>
                        </div>
                        <div className="contact-item">
                            <strong>LOCATION:</strong> India
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
