import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Privacy.css';

const Terms = () => {
    return (
        <div className="legal-page">
            <div className="container section">
                <Link to="/" className="back-link">
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <h1 className="page-title">Terms & Conditions</h1>

                <div className="legal-content">
                    <p className="intro-text">
                        Last updated: January 2026
                    </p>
                    <p>
                        Welcome to Project J (“Platform”, “we”, “our”, or “us”). These Terms & Conditions (“Terms”) govern your access to and use of our online platform, which enables jewellery stores to register and publish gold jewellery offers and discounts, and allows users to view and explore such offers.
                    </p>
                    <p>
                        By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.
                    </p>

                    <hr className="divider" />

                    <h3>1. Nature of the Platform</h3>
                    <p>Project J is an online listing and discovery platform only. We:</p>
                    <ul>
                        <li>Do not sell gold or jewellery</li>
                        <li>Do not set prices or discounts</li>
                        <li>Do not verify gold purity, weight, or pricing accuracy</li>
                        <li>Are not a party to any transaction between users and jewellery stores</li>
                    </ul>
                    <p>All purchases, negotiations, and disputes occur directly between users and jewellery stores.</p>

                    <hr className="divider" />

                    <h3>2. Eligibility</h3>
                    <ul>
                        <li>Users must be 18 years or older</li>
                        <li>Jewellery stores must be legally registered businesses operating in India</li>
                        <li>By using the Platform, you confirm that you are legally capable of entering into binding contracts under Indian law</li>
                    </ul>

                    <hr className="divider" />

                    <h3>3. Jewellery Store (Merchant) Accounts</h3>
                    <p>Jewellery stores registering on the Platform agree to:</p>
                    <ul>
                        <li>Provide accurate, current, and complete business information</li>
                        <li>Ensure all posted offers comply with applicable Indian laws, including consumer protection, hallmarking, and advertising laws</li>
                        <li>Maintain the accuracy of pricing, discounts, validity dates, and terms of offers</li>
                        <li>Update or remove expired or incorrect offers promptly</li>
                    </ul>
                    <p>We reserve the right to suspend or terminate merchant accounts that violate these Terms.</p>

                    <hr className="divider" />

                    <h3>4. User Responsibilities</h3>
                    <p>Users agree to:</p>
                    <ul>
                        <li>Use the Platform only for lawful purposes</li>
                        <li>Not misuse, copy, scrape, or manipulate offer data</li>
                        <li>Verify offer details directly with the jewellery store before making a purchase</li>
                        <li>Understand that displayed offers may change or expire without notice</li>
                    </ul>

                    <hr className="divider" />

                    <h3>5. Offers and Pricing Disclaimer</h3>
                    <ul>
                        <li>All offers, discounts, images, and descriptions are provided by jewellery stores</li>
                        <li>Gold prices are subject to market fluctuations</li>
                        <li>Final prices, making charges, taxes, and terms are determined by the jewellery store</li>
                        <li>We do not guarantee availability, accuracy, or continuity of any offer</li>
                    </ul>

                    <hr className="divider" />

                    <h3>6. No Warranty or Guarantee</h3>
                    <p>The Platform is provided on an “as is” and “as available” basis. We make no warranties regarding:</p>
                    <ul>
                        <li>Accuracy or reliability of offers</li>
                        <li>Merchant conduct or service quality</li>
                        <li>Product authenticity, purity, or certification</li>
                    </ul>
                    <p>To the maximum extent permitted by law, we disclaim all warranties, express or implied.</p>

                    <hr className="divider" />

                    <h3>7. Payments and Transactions</h3>
                    <ul>
                        <li>We do not process payments or handle refunds</li>
                        <li>All payments, exchanges, returns, and warranties are governed by the jewellery store’s own policies</li>
                        <li>Users are responsible for reviewing merchant terms before purchase</li>
                    </ul>

                    <hr className="divider" />

                    <h3>8. Intellectual Property</h3>
                    <ul>
                        <li>All Platform content (excluding merchant-submitted content), including logos, design, text, and software, is owned by or licensed to us</li>
                        <li>Jewellery stores retain ownership of their logos, trademarks, and offer content but grant us a non-exclusive right to display them on the Platform</li>
                        <li>Unauthorized use or reproduction of Platform content is prohibited</li>
                    </ul>

                    <hr className="divider" />

                    <h3>9. Prohibited Activities</h3>
                    <p>You may not:</p>
                    <ul>
                        <li>Post false, misleading, or unlawful content</li>
                        <li>Impersonate another person or business</li>
                        <li>Attempt to gain unauthorized access to the Platform</li>
                        <li>Use the Platform to distribute malware or spam</li>
                        <li>Interfere with Platform security or functionality</li>
                    </ul>

                    <hr className="divider" />

                    <h3>10. Suspension and Termination</h3>
                    <p>We reserve the right to:</p>
                    <ul>
                        <li>Suspend or terminate access to the Platform at our discretion</li>
                        <li>Remove offers or accounts that violate these Terms or applicable laws</li>
                        <li>Take action without prior notice where required for legal or security reasons</li>
                    </ul>

                    <hr className="divider" />

                    <h3>11. Limitation of Liability</h3>
                    <p>To the fullest extent permitted under Indian law:</p>
                    <ul>
                        <li>We shall not be liable for any direct, indirect, incidental, or consequential damages</li>
                        <li>We are not responsible for losses arising from transactions, disputes, or representations made by jewellery stores</li>
                        <li>Our total liability, if any, shall not exceed the amount paid (if any) by you to use the Platform</li>
                    </ul>

                    <hr className="divider" />

                    <h3>12. Indemnification</h3>
                    <p>
                        You agree to indemnify and hold harmless Project J, its owners, and affiliates from any claims, damages, losses, or expenses arising out of:
                    </p>
                    <ul>
                        <li>Your use of the Platform</li>
                        <li>Violation of these Terms</li>
                        <li>Disputes between users and jewellery stores</li>
                    </ul>

                    <hr className="divider" />

                    <h3>13. Privacy</h3>
                    <p>
                        Your use of the Platform is also governed by our Privacy Statement, which explains how we collect and use personal data.
                    </p>

                    <hr className="divider" />

                    <h3>14. Changes to Terms</h3>
                    <p>
                        We may update these Terms from time to time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.
                    </p>

                    <hr className="divider" />

                    <h3>15. Governing Law and Jurisdiction</h3>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of India. Courts located in India shall have exclusive jurisdiction.
                    </p>

                    <hr className="divider" />

                    <h3>16. Contact Information</h3>
                    <p>
                        For questions or concerns regarding these Terms, please contact us:
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

export default Terms;
