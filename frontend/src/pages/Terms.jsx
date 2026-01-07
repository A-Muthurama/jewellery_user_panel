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
                        Welcome to our website/mobile app. This website/mobile app is subject to the terms and conditions listed below. Please read them carefully before using it. You may not use this website/mobile app if you do not agree to these Terms of Use. The use of this website/mobile app constitutes your explicit assent to these terms and conditions and the website/mobile app privacy policy.
                    </p>

                    <p>
                        The term 'Project J' or 'us' or 'we' refers to the owner of the website/mobile app. The term 'you' refers to the user or viewer of our website/mobile app.
                    </p>

                    <h2>Terms of Use</h2>
                    <p>The use of this website is subject to the following terms of use:</p>

                    <ul>
                        <li>The content of the pages of this website/mobile app is for your general information and use only. It is subject to change without notice.</li>

                        <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>

                        <li>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, or information available through this website meet your specific requirements.</li>

                        <li>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>

                        <li>Due to screen defaults and photography techniques, some items may appear larger or smaller than they actually are. In some cases, the items may be displayed larger for more clarity or smaller for a complete view. On this account, the company is not liable for any legal action.</li>

                        <li>For any of the prepaid orders, if there happens to be a weight difference for the product from the displayed figure in website/mobile app, then the amount could be adjusted, either providing a partial refund for lesser-weighted items or accepting a further amount for higher-weighted items.</li>

                        <li>A standard weight tolerance of +/- 0.05gm may apply to gold coin/bars, silver coin/bars, and gold coin pendants.</li>

                        <li>All trademarks reproduced in this website/mobile app which are not the property of, or licensed to, the operator are acknowledged on the website/mobile app.</li>

                        <li>Unauthorized use of this website/mobile app may give rise to a claim for damages and/or be a criminal offence.</li>

                        <li>From time to time this website/mobile app may also include links to other websites/mobile apps. These links are provided for your convenience to provide further information. They do not signify that we endorse the website/mobile app. We have no responsibility for the content of the linked website/mobile app.</li>

                        <li>You may not create a link to this website/mobile app from another website/mobile app or document without Project J's prior written consent.</li>

                        <li>Your use of this website/mobile app and any dispute arising out of such use of the website/mobile app is subject to the laws of India or other regulatory authority.</li>
                    </ul>

                    <h2>Contact Us</h2>
                    <p>If there are any questions regarding these terms and conditions, you may contact us using the information below:</p>

                    <div className="contact-info">
                        <div className="contact-item">
                            <strong>EMAIL:</strong> <a href="mailto:contact@projectj.com">contact@projectj.com</a>
                        </div>
                        <div className="contact-item">
                            <strong>PHONE:</strong> +1 234 567 8900
                        </div>
                        <div className="contact-item">
                            <strong>ADDRESS:</strong> 123 Gold Street, Jewellery District, NY
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
