import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router";

const Forbidden = () => {

  const [isLocked, setIsLocked] = useState(false); 
  const [showFinalLock, setShowFinalLock] = useState(false); 

  useEffect(() => {
    const unlockTimer = setTimeout(() => {
      setIsLocked(true); 
    }, 800); 

    const lockTimer = setTimeout(() => {
      setIsLocked(false); 
      setShowFinalLock(true); 
    }, 1600); 

    return () => {
      clearTimeout(unlockTimer);
      clearTimeout(lockTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AnimationContainer>
   
        {isLocked && (
          <div className="lock-container animating">
            <input id="inpLockAnimating" type="checkbox" />
            <label className="btn-lock" htmlFor="inpLockAnimating">
              <svg  width={120} height={180} viewBox="0 0 36 40">
                <path
                  className="lockb"
                  d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"
                />
                <path
                  className="lock"
                  d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"
                />
                <path className="bling" d="M29 20L31 22" />
                <path className="bling" d="M31.5 15H34.5" />
                <path className="bling" d="M29 10L31 8" />
              </svg>
            </label>
          </div>
        )}

        {showFinalLock && (
          <div className="lock-container final">
            <input id="inpLockFinal" type="checkbox" defaultChecked />
            <label className="btn-lock" htmlFor="inpLockFinal">
              <svg width={120} height={180} viewBox="0 0 36 40">
                <path
                  className="lockb"
                  d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"
                />
                <path
                  className="lock"
                  d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"
                />
                <path className="bling" d="M29 20L31 22" />
                <path className="bling" d="M31.5 15H34.5" />
                <path className="bling" d="M29 10L31 8" />
              </svg>
            </label>
          </div>
        )}
      </AnimationContainer>

      <h1 className="text-3xl font-bold text-red-500 mt-8">
        You Are Forbidden to Access This Page
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        Please contact the administrator if you believe this is an error.
      </p>
      <div className="mt-7">
        <Link
          to="/"
          className="px-4 py-4 w-full bg-indigo-600 rounded-full text-white font-medium hover:bg-red-800"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

const AnimationContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 1rem;

  .lock-container.animating {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
    animation: fadeIn 0.3s ease-out;

    .btn-lock {
      display: inline-block;
      background: #3f27f5; /* Red for locked */
      width: 200px;
      height: 200px;
      box-sizing: border-box;
      padding: 8px 2px 4px 46px;
      border-radius: 50%;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      animation: lockPopIn 0.8s ease-out;
    }
  }

  .lock-container.final {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: fadeIn 0.5s ease-out;

    .btn-lock {
      display: inline-block;
      background: #3f27f5;
      width: 200px;
      height: 200px;
      box-sizing: border-box;
      padding: 8px 2px 4px 46px;
      border-radius: 50%;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    #inpLockFinal:checked + .btn-lock {
      background: #f52727;
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes lockPopIn {
    0% {
      transform: scale(0);
    }
    70% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  /* SVG Styles */
  .btn-lock svg {
    fill: none;
    transform: translate3d(0, 0, 0);
  }

  .btn-lock svg .bling,
  .bling {
    stroke: #fff;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 3;
    stroke-dashoffset: 15;
    transition: all 0.3s ease;
  }

  .btn-lock svg .lock,
  .lock {
    stroke: #fff;
    stroke-width: 4;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-dasharray: 36;
    transition: all 0.4s ease;
  }

  .btn-lock svg .lockb,
  .lockb {
    fill: #fff;
    fill-rule: evenodd;
    clip-rule: evenodd;
    transform: rotate(8deg);
    transform-origin: 14px 20px;
    transition: all 0.2s ease;
  }

  /* Checkbox states */

  #inpLockAnimating,
  #inpLockFinal {
    display: none;
  }

  .lock-container.final #inpLockFinal:checked + .btn-lock svg .bling {
    animation: bling6132 0.3s linear forwards;
    animation-delay: 0.2s;
  }

  .lock-container.final #inpLockFinal:checked + .btn-lock svg .lock {
    stroke-dasharray: 48;
    animation: locked 0.3s linear forwards;
  }

  .lock-container.final #inpLockFinal:checked + .btn-lock svg .lockb {
    transform: rotate(0);
    transform-origin: 14px 22px;
  }

  @keyframes bling6132 {
    50% {
      stroke-dasharray: 3;
      stroke-dashoffset: 12;
    }
    100% {
      stroke-dasharray: 3;
      stroke-dashoffset: 9;
    }
  }

  @keyframes locked {
    100% {
      transform: translateY(1px);
    }
  }
`;

export default Forbidden;
