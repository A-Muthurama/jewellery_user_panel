import React from "react";
import "./Regulation.css";
import { ShieldCheck, ExternalLink, Scale } from "lucide-react";

const Regulation = () => {
  return (
    <div className="regulation-page container section">
      {/* Header */}
      <div className="regulation-header">
        <ShieldCheck size={36} className="header-icon" />
        <h1>Jewellery Regulations & Standards</h1>
        <p>
          We reference official Indian authorities to ensure transparency,
          authenticity, and trust in jewellery offers displayed on our platform.
        </p>
      </div>

      {/* Authority Cards */}
      <div className="authority-grid">
        <div className="authority-card">
          <h3>Gems & Jewellery Council of India (GJC)</h3>
          <p>
            GJC is the apex body representing the Indian gems and jewellery
            industry, promoting ethical trade practices and compliance.
          </p>
          <a
            href="https://www.gjc.org.in/"
            target="_blank"
            rel="noreferrer"
          >
            Visit Official Website <ExternalLink size={14} />
          </a>
        </div>

        <div className="authority-card">
          <h3>Bureau of Indian Standards (BIS)</h3>
          <p>
            BIS is the national standards body of India, responsible for gold
            hallmarking, purity certification, and consumer protection.
          </p>
          <a
            href="https://www.bis.gov.in/?lang=en"
            target="_blank"
            rel="noreferrer"
          >
            View BIS Guidelines <ExternalLink size={14} />
          </a>
        </div>

        <div className="authority-card">
          <h3>India Bullion & Jewellers Association (IBJA)</h3>
          <p>
            IBJA publishes daily bullion reference rates and supports pricing
            transparency across the jewellery ecosystem.
          </p>
          <a
            href="https://ibjarates.com/"
            target="_blank"
            rel="noreferrer"
          >
            Check IBJA Rates <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Highlights */}
      <div className="regulation-highlights">
        <h2>Key Regulatory Highlights</h2>

        <div className="highlight-item">
          <Scale size={20} />
          <div>
            <h4>Hallmarking & Purity</h4>
            <p>
              Gold jewellery sold in India must follow BIS hallmarking norms,
              ensuring purity and consumer trust.
            </p>
          </div>
        </div>

        <div className="highlight-item">
          <Scale size={20} />
          <div>
            <h4>Transparent Pricing</h4>
            <p>
              Jewellery pricing is influenced by daily bullion rates published
              by recognised trade bodies like IBJA.
            </p>
          </div>
        </div>

        <div className="highlight-item">
          <Scale size={20} />
          <div>
            <h4>Ethical Trade Practices</h4>
            <p>
              Industry associations promote ethical sourcing, fair trade, and
              compliance with national regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="regulation-disclaimer">
        <p>
          Disclaimer: This page provides informational references only. For
          official rules, notifications, and legal compliance, please refer to
          the respective authority websites.
        </p>
        <span>Last updated: August 2026</span>
      </div>
    </div>
  );
};

export default Regulation;
