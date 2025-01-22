// uSER for GDPR ETC
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 30, path: '/' });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40"></div>

      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-4 z-50 flex justify-center items-center">
        <div className="max-w-lg w-full text-center">
          <p className="mb-4">
            We use cookies to enhance your experience and analyze our traffic. By clicking "Accept Cookies", you consent to our use of cookies.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-white underline">
              Privacy Policy
            </a>
            <a href="/cookies-policy" target="_blank" rel="noopener noreferrer" className="text-white underline">
              Cookies Policy
            </a>
          </div>
          <div className="mt-4">
            <button
              onClick={handleAccept}
              className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
