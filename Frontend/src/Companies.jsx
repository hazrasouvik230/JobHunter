import React from 'react';

const Companies = () => {
    const companiesLogos = [
        "/Amazon.png",
        "/Figma.png",
        "/Google.png",
        "/Meta.png",
        "/Microsoft.png",
        "/Netflix.png",
        "/Oracle.png",
        "/Pinterest.png",
        "/Slack.png",
        "/Spotify.png",
        "/Walmart.png",
    ];

    const duplicatedLogos = [...companiesLogos, ...companiesLogos]; // For seamless loop

    return (
        <div className="bg-blue-200/20 overflow-hidden w-full py-4">
            <div className="flex animate-scroll whitespace-nowrap min-w-max">
                {duplicatedLogos.map((logo, index) => (
                    <img key={index} src={logo} alt={`logo-${index}`} className="bg-blue-300/30 w-36 py-2 rounded-lg px-8 mx-2 shadow-lg" />
                ))}
            </div>
            <style jsx>
                {`
                    @keyframes scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }

                    .animate-scroll {
                        animation: scroll 30s linear infinite;
                    }
                `}
            </style>
        </div>
    );
};

export default Companies;
