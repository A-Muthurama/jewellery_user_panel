import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import "./LiveRatesBar.css";

const LiveRatesBar = () => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        let es;

        // initial fetch to populate UI quickly
        const fetchInitial = async () => {
            try {
                const res = await fetch('/api/metal-prices');
                if (res.ok) {
                    const data = await res.json();
                    setRates(data);
                }
            } catch (err) {
                console.warn('Initial fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitial();

        // connect to SSE for realtime updates
        try {
            es = new EventSource('/api/metal-prices/stream');

            es.onmessage = (evt) => {
                try {
                    const data = JSON.parse(evt.data);
                    setRates(data);
                    setLoading(false);
                    setIsLive(true);
                } catch (err) {
                    console.warn('SSE parse error:', err);
                }
            };

            es.onerror = (err) => {
                console.warn('SSE error:', err);
                setIsLive(false);
                // EventSource will attempt reconnects automatically.
            };
        } catch (err) {
            console.warn('EventSource not supported or failed:', err);
        }

        return () => {
            if (es && es.close) es.close();
        };
    }, []);

    const renderTrendIcon = (trend) => {
        if (trend === "up") return <TrendingUp size={14} className="trend-icon up" />;
        if (trend === "down") return <TrendingDown size={14} className="trend-icon down" />;
        return <Minus size={14} className="trend-icon stable" />;
    };

    const formatPrice = (price) => {
        return price ? price.toLocaleString('en-IN') : '0';
    };

    if (loading) return null; // still loading
    if (!rates) return <div className="live-rates-bar empty">Rates currently unavailable</div>; // fallback UI when fetch failed or rate-limited

    return (
        <div className="live-rates-bar">
            <div className="rates-container">
                <div className="rate-ticker">

                    {/* Gold 22K */}
                    <div className="rate-item">
                        <span className="metal-label">Gold 22K</span>
                        <div className="price-row">
                            <div className="price-group">
                                <span className="weight-label">1g</span>
                                <span className="price-value">₹{formatPrice(rates.gold.price22k)}</span>
                                {renderTrendIcon(rates.gold.trend)}
                            </div>
                            <span className="price-separator">—</span>
                            <div className="price-group">
                                <span className="weight-label">8g</span>
                                <span className="price-value">
                                    ₹{formatPrice(rates.gold.price22k * 8)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Gold 24K */}
                    <div className="rate-item">
                        <span className="metal-label">Gold 24K</span>
                        <div className="price-row">
                            <div className="price-group">
                                <span className="weight-label">1g</span>
                                <span className="price-value">₹{formatPrice(rates.gold.price24k)}</span>
                            </div>
                            <span className="price-separator">—</span>
                            <div className="price-group">
                                <span className="weight-label">8g</span>
                                <span className="price-value">
                                    ₹{formatPrice(rates.gold.price24k * 8)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Silver */}
                    <div className="rate-item">
                        <span className="metal-label">Silver</span>
                        <div className="price-row">
                            <div className="price-group">
                                <span className="weight-label">1g</span>
                                <span className="price-value">₹{formatPrice(rates.silver.price)}</span>
                                {renderTrendIcon(rates.silver.trend)}
                            </div>
                            <span className="price-separator">—</span>
                            <div className="price-group">
                                <span className="weight-label">1kg</span>
                                <span className="price-value">
                                    ₹{formatPrice(rates.silver.price * 1000)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Platinum */}
                    <div className="rate-item">
                        <span className="metal-label">Platinum</span>
                        <div className="price-row">
                            <div className="price-group">
                                <span className="weight-label">1g</span>
                                <span className="price-value">₹{formatPrice(rates.platinum.price)}</span>
                                {renderTrendIcon(rates.platinum.trend)}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="rates-updated">
                <span className="updated-text">Last updated: {new Date(rates.updatedAt).toLocaleTimeString()}</span>
                {isLive ? (
                    <span className="live-indicator">● Live</span>
                ) : null}
            </div>
        </div>
    );
};

export default LiveRatesBar;
