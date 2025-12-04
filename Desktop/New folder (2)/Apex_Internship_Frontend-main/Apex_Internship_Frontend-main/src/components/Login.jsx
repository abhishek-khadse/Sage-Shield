import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  LogOut, 
  Copy, 
  LayoutGrid, 
  Fingerprint,
  Wallet,
  Sparkles,
  Zap
} from 'lucide-react';
import { useToast } from './common/Toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Secure storage utilities
const secureStorage = {
  setToken: (token) => {
    try {
      sessionStorage.setItem('auth_token', token);
      // Also store timestamp for expiration check
      sessionStorage.setItem('auth_timestamp', Date.now().toString());
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },
  getToken: () => {
    try {
      return sessionStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },
  clearAuth: () => {
    try {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_timestamp');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_timestamp');
    } catch (error) {
      console.error('Failed to clear auth storage:', error);
    }
  },
  isTokenExpired: () => {
    const timestamp = sessionStorage.getItem('auth_timestamp');
    if (!timestamp) return true;
    // Token expires after 24 hours
    return Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000;
  }
}; 

const NovaFiWallet = ({ onLogin }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo, showLoading, dismissToast } = useToast();
  
  // --- STATE MANAGEMENT ---
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(null); 
  const [connectionState, setConnectionState] = useState('idle'); 
  
  // User Data
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null); 
  const [chainId, setChainId] = useState(null);
  const [hasValidSession, setHasValidSession] = useState(false); 
  const [jwtToken, setJwtToken] = useState(null);
  
  // UI State
  const [showMoreWallets, setShowMoreWallets] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- CONSTANTS & CONFIG ---
  const slides = [
    { id: 1, image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&q=80"}, 
    { id: 2, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80"}, 
    { id: 3, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"}, 
    { id: 4, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"},
    { id: 5, image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"},
  ];

  const walletDownloads = {
    metamask: "https://metamask.io/download/",
    coinbase: "https://www.coinbase.com/wallet/downloads",
    phantom: "https://phantom.app/download",
    trust: "https://trustwallet.com/browser-extension",
  };

  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '/svg/metamask.svg', recommended: true, subtitle: 'Most popular' },
    { id: 'coinbase', name: 'Coinbase', icon: '/svg/coinbase.svg', subtitle: 'Simple & secure' },
    { id: 'phantom', name: 'Phantom', icon: '/svg/phantom.svg', subtitle: 'Solana wallet' },
    { id: 'trust', name: 'Trust Wallet', icon: '/svg/trust.svg', subtitle: 'Mobile friendly' },
  ];

  // --- AUTHENTICATION LOGIC ---
  const signMessage = useCallback(async (walletAddress) => {
    let loadingToastId = null;
    
    try {
      const { ethereum } = window;
      if (!ethereum) {
        showError('Wallet Not Found', 'Please install MetaMask or another Web3 wallet');
        throw new Error("Ethereum provider not available for signing.");
      }

      setIsLoading('signing');
      setErrorMsg(null);
      setHasValidSession(false); 
      
      // Show loading toast
      loadingToastId = showLoading(
        'Connecting to Wallet', 
        'Please check your wallet for signature request...'
      );

      // 1. Get Challenge (Nonce)
      const challengeRes = await fetch(`${API_BASE_URL}/auth/challenge?walletAddress=${encodeURIComponent(walletAddress)}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      if (!challengeRes.ok) {
         const errorBody = await challengeRes.json();
         throw new Error(errorBody.detail || "Failed to fetch login challenge");
      }
      
      const challengeData = await challengeRes.json();
      const messageToSign = challengeData.message; 
      const nonce = challengeData.nonce;

      // Update loading toast
      if (loadingToastId) {
        dismissToast(loadingToastId);
      }
      loadingToastId = showLoading(
        'Signing Message', 
        'Please approve the signature in your wallet...'
      );

      // 2. Sign Message via Wallet
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [messageToSign, walletAddress],
      });

      // Update loading toast
      if (loadingToastId) {
        dismissToast(loadingToastId);
      }
      loadingToastId = showLoading(
        'Verifying Signature', 
        'Checking your authentication with the server...'
      );

      // 3. Verify & Login
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          walletAddress: walletAddress,
          signature: signature,
          nonce: nonce
        })
      });

      if (!loginRes.ok) {
          const errorBody = await loginRes.json();
          throw new Error(errorBody.detail || "Login verification failed");
      }

      const loginData = await loginRes.json();
      
      // 4. Store Token & Trigger App Authentication
      if (loginData.access_token) {
        secureStorage.setToken(loginData.access_token);
        setJwtToken(loginData.access_token);
        setHasValidSession(true); 
        
        // Dismiss loading and show success
        if (loadingToastId) {
          dismissToast(loadingToastId);
        }
        showSuccess(
          'Authentication Successful!', 
          'Welcome to NovaFi. Redirecting to dashboard...'
        );
        
        console.log("Authentication complete. Token stored.");
        
        // **KEY FIX**: Notify App.jsx that login succeeded
        if (onLogin) {
          onLogin();
        }
        
        // Navigate after a short delay to show success state
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        throw new Error("No token received");
      }

    } catch (err) {
      console.error("Sign/Login Error:", err);
      
      // Dismiss loading toast
      if (loadingToastId) {
        dismissToast(loadingToastId);
      }
      
      // Show appropriate error toast
      const errorType = getErrorType(err);
      switch (errorType) {
        case 'user_rejected':
          showWarning(
            'Transaction Cancelled', 
            'You cancelled the signature request. Please try again if you want to continue.'
          );
          break;
        case 'wallet_locked':
          showError(
            'Wallet Locked', 
            'Please unlock your wallet and try again.'
          );
          break;
        case 'network_error':
          showError(
            'Network Error', 
            'Unable to connect to the server. Please check your internet connection and try again.'
          );
          break;
        case 'auth_error':
          showError(
            'Authentication Failed', 
            'Unable to verify your signature. Please try again.'
          );
          break;
        default:
          showError(
            'Connection Error', 
            err.message || 'An unexpected error occurred. Please try again.'
          );
      }
      
      setErrorMsg(err.message || "Authentication failed. Try to disconnect and reconnect.");
      setHasValidSession(false);
    } finally {
      setIsLoading(null);
    }
  }, [onLogin, navigate, showSuccess, showError, showWarning, showLoading, dismissToast]);

  // --- ERROR CATEGORIZATION ---
  const getErrorType = (error) => {
    if (error.code === 4001) return 'user_rejected';
    if (error.code === -32002) return 'wallet_locked';
    if (error.message?.includes('Unsupported network')) return 'network_error';
    if (error.message?.includes('Failed to fetch')) return 'network_error';
    if (error.message?.includes('No token received')) return 'auth_error';
    return 'general_error';
  };

  const getErrorMessage = (error) => {
    const errorType = getErrorType(error);
    
    switch (errorType) {
      case 'user_rejected':
        return 'Transaction rejected by user. Please try again.';
      case 'wallet_locked':
        return 'Wallet is locked. Please unlock your wallet and try again.';
      case 'network_error':
        return 'Network error. Please check your connection and try again.';
      case 'auth_error':
        return 'Authentication failed. Please try signing in again.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'user_rejected':
        return <ShieldCheck className="w-4 h-4 flex-shrink-0" />;
      case 'wallet_locked':
        return <Fingerprint className="w-4 h-4 flex-shrink-0" />;
      case 'network_error':
        return <LayoutGrid className="w-4 h-4 flex-shrink-0" />;
      case 'auth_error':
        return <ShieldCheck className="w-4 h-4 flex-shrink-0" />;
      default:
        return <ShieldCheck className="w-4 h-4 flex-shrink-0" />;
    }
  };

  const getErrorColor = (errorType) => {
    switch (errorType) {
      case 'user_rejected':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 'wallet_locked':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'network_error':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'auth_error':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-red-500/10 border-red-500/20 text-red-400';
    }
  };
  useEffect(() => {
    const interval = setInterval(() => setActiveSlide(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const checkSession = async () => {
      const storedToken = secureStorage.getToken();
      if (storedToken && !secureStorage.isTokenExpired()) {
        try {
          setIsLoading('signing'); 
          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors'
          });
          
          if (response.ok) {
            const data = await response.json(); 
            setHasValidSession(true);
            setJwtToken(storedToken);
            setAccount(data.walletAddress || "0x..."); 
            setConnectionState('connected');
            console.log("Session restored for:", data.walletAddress);
            
            // If already authenticated, redirect to dashboard
            if (onLogin) {
              onLogin();
            }
            navigate('/');
          } else {
            secureStorage.clearAuth();
          }
        } catch (e) {
          console.error("Session check failed", e);
          secureStorage.clearAuth();
        } finally {
          setIsLoading(null);
        }
      } else if (secureStorage.isTokenExpired()) {
        secureStorage.clearAuth();
      }
    };
    checkSession();
  }, [onLogin, navigate]);

  // --- WEB3 SECURITY CONFIG ---
  const SUPPORTED_CHAINS = {
    1: 'Ethereum Mainnet',
    137: 'Polygon',
    80001: 'Polygon Mumbai',
    42161: 'Arbitrum One'
  };
  
  const REQUIRED_CHAIN_ID = '0x1'; // Ethereum Mainnet
  const CHAIN_ID_DECIMAL = 1;

  // --- WALLET LOGIC ---
  const detectProvider = (walletId) => {
    const { ethereum, phantom } = window;
    if (!ethereum && !phantom) return null;

    switch (walletId) {
      case 'metamask': return ethereum?.isMetaMask ? ethereum : null;
      case 'coinbase': return ethereum?.isCoinbaseWallet ? ethereum : null;
      case 'phantom': return phantom?.ethereum || (ethereum?.isPhantom ? ethereum : null);
      case 'trust': return ethereum?.isTrust ? ethereum : null;
      default: return ethereum;
    }
  };

  // Validate wallet address format
  const isValidAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Check if network is supported
  const isSupportedNetwork = (chainId) => {
    const chainIdDecimal = parseInt(chainId, 16);
    return Object.keys(SUPPORTED_CHAINS).includes(chainIdDecimal.toString());
  };

  // Switch to required network
  const switchNetwork = async (provider) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: REQUIRED_CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: REQUIRED_CHAIN_ID,
                chainName: 'Ethereum Mainnet',
                rpcUrls: ['https://mainnet.infura.io/v3/'],
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
          throw new Error('Failed to add Ethereum Mainnet to wallet');
        }
      } else {
        throw new Error('Failed to switch to Ethereum Mainnet');
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          disconnect();
        } else if (accounts[0] !== account) {
          // Account changed, disconnect and reconnect
          disconnect();
          setErrorMsg('Wallet account changed. Please reconnect.');
        }
      };

      const handleChainChanged = (chainId) => {
        if (!isSupportedNetwork(chainId)) {
          setErrorMsg(`Unsupported network. Please switch to ${SUPPORTED_CHAINS[CHAIN_ID_DECIMAL]}`);
          disconnect();
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  const handleConnect = async (walletId) => {
    // Prevent multiple rapid clicks
    if (isLoading) {
      showWarning('Connection in Progress', 'Please wait for the current connection to complete.');
      return;
    }
    
    setErrorMsg(null);
    setIsLoading(walletId);
    setConnectionState('connecting');

    try {
      const provider = detectProvider(walletId);

      if (!provider) {
        const confirm = window.confirm(`Re-directing to ${walletId} download page. Continue?`);
        if (confirm) {
          window.open(walletDownloads[walletId] || "https://metamask.io", '_blank');
          showInfo(
            'Wallet Download Started', 
            `Please install ${walletId} and refresh the page to continue.`
          );
        }
        throw new Error("Wallet not installed");
      }

      // Show connection loading toast
      const loadingToastId = showLoading(
        'Connecting to Wallet', 
        `Connecting to ${walletId}...`
      );

      // Request accounts
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!accounts?.[0]) {
        dismissToast(loadingToastId);
        throw new Error("No account accessible");
      }

      const walletAddress = accounts[0];
      
      // Validate address format
      if (!isValidAddress(walletAddress)) {
        dismissToast(loadingToastId);
        throw new Error("Invalid wallet address format");
      }

      // Check network
      const chain = await provider.request({ method: 'eth_chainId' });
      
      if (!isSupportedNetwork(chain)) {
        dismissToast(loadingToastId);
        showWarning(
          'Network Not Supported', 
          `Switching to ${SUPPORTED_CHAINS[CHAIN_ID_DECIMAL]}...`
        );
        
        // Try to switch to supported network
        await switchNetwork(provider);
        // Re-check chain after switch attempt
        const newChain = await provider.request({ method: 'eth_chainId' });
        if (!isSupportedNetwork(newChain)) {
          throw new Error(`Unsupported network. Please switch to ${SUPPORTED_CHAINS[CHAIN_ID_DECIMAL]}`);
        }
      }
      
      dismissToast(loadingToastId);
      showSuccess(
        'Wallet Connected', 
        `Successfully connected to ${walletId}`
      );
      
      setAccount(walletAddress);
      setChainId(chain);
      setConnectionState('connected');
      
      // Automatically execute the signing and login process
      await signMessage(walletAddress);

    } catch (err) {
      console.error('Wallet connection error:', err);
      
      // Handle specific error types
      if (err.code === 4001) {
        showWarning(
          'Connection Cancelled', 
          'You cancelled the wallet connection request.'
        );
      } else if (err.code === -32002) {
        showError(
          'Wallet Locked', 
          'Please unlock your wallet and try again.'
        );
      } else if (err.message.includes('Unsupported network')) {
        showError(
          'Network Error', 
          err.message
        );
      } else if (err.message !== "Wallet not installed") {
        showError(
          'Connection Failed', 
          err.message || 'Failed to connect to wallet'
        );
      }
      
      setErrorMsg(err.message || "Connection failed");
      setConnectionState('idle');
      setHasValidSession(false);
    } finally {
      setIsLoading(null);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    setHasValidSession(false); 
    setJwtToken(null);
    setConnectionState('idle');
    setErrorMsg(null);
    secureStorage.clearAuth();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    showSuccess('Address Copied', 'Wallet address copied to clipboard');
  };

  const formatAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  // Accessibility: Handle keyboard navigation
  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* LEFT PANEL - CYBERPUNK CITYSCAPE */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-black">
        {/* Cyberpunk city background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&q=80" 
            alt="Cyberpunk City" 
            className="w-full h-full object-cover opacity-60"
          />
          {/* Dark overlay with vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70" />
          
          {/* Enhanced vertical neon lights with animation */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute left-1/4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 opacity-80 blur-sm"
              animate={{
                opacity: [0.4, 0.9, 0.4],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 via-purple-500 to-pink-600 opacity-60 blur-sm"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scaleY: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute right-1/4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-cyan-500 to-teal-600 opacity-70 blur-sm"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scaleY: [0.7, 1.3, 0.7],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
          
          {/* Cyberpunk structural elements */}
          <div className="absolute inset-0">
            {/* Enhanced holographic grid mesh */}
            <div className="absolute inset-0 opacity-40">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cybergrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="cyan" strokeWidth="0.8" opacity="0.5"/>
                    <path d="M 0 0 L 60 60 M 60 0 L 0 60" fill="none" stroke="blue" strokeWidth="0.5" opacity="0.3"/>
                    <circle cx="30" cy="30" r="2" fill="cyan" opacity="0.4"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cybergrid)" />
              </svg>
            </div>
            
            {/* Animated geometric holographic shapes */}
            <motion.div 
              className="absolute top-1/4 left-1/6 w-32 h-32 border border-cyan-400/50 transform rotate-45 scale-75"
              animate={{
                rotate: [45, 405],
                scale: [0.75, 0.85, 0.75],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute top-1/3 right-1/5 w-24 h-24 border border-purple-400/40 transform rotate-12 scale-90"
              animate={{
                rotate: [12, -348],
                scale: [0.9, 1, 0.9],
                opacity: [0.25, 0.5, 0.25],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: 2
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 left-1/3 w-40 h-40 border border-blue-400/35 transform -rotate-6 scale-60"
              animate={{
                rotate: [-6, 354],
                scale: [0.6, 0.7, 0.6],
                opacity: [0.2, 0.45, 0.2],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
            />
            
            {/* Enhanced floating hexagon structures */}
            <motion.div
              className="absolute top-1/2 left-1/4 w-20 h-20"
              animate={{
                rotate: [0, 360],
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
                <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" 
                         fill="none" 
                         stroke="cyan" 
                         strokeWidth="1.5"/>
                <polygon points="50,25 70,37.5 70,62.5 50,75 30,62.5 30,37.5" 
                         fill="none" 
                         stroke="blue" 
                         strokeWidth="0.8"/>
                <circle cx="50" cy="50" r="5" fill="cyan" opacity="0.6"/>
              </svg>
            </motion.div>
            <motion.div
              className="absolute bottom-1/3 right-1/3 w-16 h-16"
              animate={{
                rotate: [0, -360],
                x: [0, -20, 0],
                y: [0, 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
                <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" 
                         fill="none" 
                         stroke="purple" 
                         strokeWidth="1.2"/>
                <circle cx="50" cy="50" r="3" fill="purple" opacity="0.5"/>
              </svg>
            </motion.div>
            
            {/* Gradient mesh overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-purple-500/8" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-pink-500/5" />
            <div className="absolute top-0 left-0 w-1/2 h-1/2">
              <div className="w-full h-full rounded-full bg-cyan-400/15 blur-3xl" />
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3">
              <div className="w-full h-full rounded-full bg-purple-400/12 blur-3xl" />
            </div>
          </div>
          
          {/* Fog effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Enhanced floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
          {/* Additional holographic particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`hologram-${i}`}
              className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - NEON LOGIN */}
      <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-8 md:p-12">
        
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-transparent to-violet-950/20" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 30, -30, 0],
                y: [0, -30, 30, 0],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-[440px] relative z-10">
          
          {/* BRAND HIERARCHY */}
          <div className="mb-12 text-center">
            {/* Main Logo */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img 
                  src="/image/AlbusSecurityLogo.png"
                  alt="Albus Security Logo"
                  className="h-16 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                />
                {/* Neon glow effect */}
                <div className="absolute inset-0 blur-xl bg-cyan-400/20 scale-150" />
              </div>
            </div>
            
            {/* Tagline */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
              Albus Security
            </h1>
            
            {/* Powered by NovaFi */}
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>powered by NovaFi</span>
              <Zap className="w-4 h-4" />
            </div>
            
            {/* Subtitle */}
            <p className="text-cyan-200/70 text-sm mt-4 font-light whitespace-nowrap overflow-visible">
              Enter the future of cybersecurity
            </p>
          </div>

          {/* ERROR TOAST WITH IMPROVED CATEGORIZATION */}
          {errorMsg && (
            <div className={`mb-6 p-3 rounded-lg flex items-center gap-3 text-xs font-medium animate-in slide-in-from-top-2 ${getErrorColor(getErrorType({ message: errorMsg }))}`}>
              {getErrorIcon(getErrorType({ message: errorMsg }))}
              <span className="flex-1">{getErrorMessage({ message: errorMsg })}</span>
              <button 
                onClick={() => setErrorMsg(null)} 
                className="ml-auto hover:opacity-70 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}

          {/* --- VIEW: CONNECTED DASHBOARD --- */}
          {account ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Account Status Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#13131a] to-[#0f0f13] border border-white/10 shadow-2xl relative overflow-hidden group backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-500/5 before:via-purple-500/3 before:to-blue-500/5 before:-z-10 hover:shadow-[0_25px_50px_rgb(99,102,241,0.15)] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                    ${hasValidSession ? 'bg-green-600' : 'bg-indigo-600'}
                  `}>
                    {hasValidSession ? <CheckCircle2 className='w-4 h-4'/> : <Fingerprint className='w-4 h-4'/>}
                  </div>
                  <div className="flex-grow">
                    <div className="font-mono text-slate-300 text-sm flex-grow font-semibold">
                       {formatAddress(account)}
                    </div>
                    <div className={`text-xs font-medium ${hasValidSession ? 'text-green-400' : 'text-indigo-400'}`}>
                       {hasValidSession ? 'Identity Verified' : 'Wallet Connected, Verifying...'}
                    </div>
                  </div>
                  <button onClick={copyToClipboard} className="p-1.5 hover:bg-white/10 rounded-md text-slate-500 hover:text-white transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Grid with Improved Loading States */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`col-span-2 p-3 rounded-xl border border-white/5 flex items-center justify-center gap-2 font-semibold text-sm transition-all cursor-default
                    ${hasValidSession 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}
                  `}
                >
                  {isLoading === 'signing' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> 
                      <div className="flex flex-col items-center">
                        <span>Signing Message...</span>
                        <span className="text-xs opacity-70 mt-1">Please check your wallet</span>
                      </div>
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> 
                      <div className="flex flex-col items-center">
                        <span>Connecting...</span>
                        <span className="text-xs opacity-70 mt-1">Please wait</span>
                      </div>
                    </>
                  ) : hasValidSession ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> 
                      <div className="flex flex-col items-center">
                        <span>Access Granted</span>
                        <span className="text-xs opacity-70 mt-1">Redirecting to dashboard...</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> 
                      <div className="flex flex-col items-center">
                        <span>Authentication Required</span>
                        <span className="text-xs opacity-70 mt-1">Check your wallet for signature request</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button 
                onClick={disconnect}
                onKeyDown={(e) => handleKeyDown(e, disconnect)}
                className="w-full mt-4 py-3 text-xs font-bold text-red-400/70 hover:text-red-400 uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-500/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Disconnect wallet and sign out"
              >
                <LogOut className="w-3 h-3" /> Disconnect Wallet
              </button>

            </div>
          ) : (
            
          /* --- VIEW: CONNECT WALLET LIST --- */
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Wallet Connection Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-400/30 mb-4">
                  <Wallet className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
                <p className="text-cyan-200/60 text-sm font-light">
                  Secure access to the Albus Security platform
                </p>
              </div>

              {/* Wallet Options Grid */}
              <div className="grid grid-cols-2 gap-4">
                {wallets.map((wallet) => (
                  <motion.button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet.id)}
                    onKeyDown={(e) => handleKeyDown(e, () => handleConnect(wallet.id))}
                    disabled={isLoading === wallet.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative p-5 rounded-2xl border transition-all duration-300 backdrop-blur-sm overflow-hidden group
                      ${isLoading === wallet.id 
                        ? 'bg-cyan-500/10 border-cyan-500/30 cursor-not-allowed' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }
                      focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black
                    `}
                    aria-label={`Connect to ${wallet.name} wallet`}
                    aria-busy={isLoading === wallet.id}
                  >
                    {/* Cyberpunk Hover Effects */}
                    {isLoading !== wallet.id && (
                      <>
                        {/* Neon edge glow effect */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 rounded-2xl border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.6),0_0_40px_rgba(6,182,212,0.3),inset_0_0_20px_rgba(6,182,212,0.1)]" />
                          <div className="absolute inset-0 rounded-2xl border border-aqua-400/30 shadow-[0_0_15px_rgba(0,255,255,0.4),inset_0_0_15px_rgba(0,255,255,0.05)]" />
                        </div>
                        
                        {/* Geometric light ripples */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="absolute w-full h-full rounded-2xl border-2 border-cyan-400/20 scale-0 group-hover:scale-110 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100" />
                          <div className="absolute w-full h-full rounded-2xl border border-purple-400/15 scale-0 group-hover:scale-125 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-60" />
                          <div className="absolute w-full h-full rounded-2xl border border-aqua-400/10 scale-0 group-hover:scale-140 transition-transform duration-900 ease-out opacity-0 group-hover:opacity-30" />
                        </div>
                        
                        {/* Holographic particles scatter effect */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={`particle-${i}`}
                              className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100"
                              style={{
                                left: '50%',
                                top: '50%',
                                backgroundColor: i % 3 === 0 ? 'rgb(6, 182, 212)' : i % 3 === 1 ? 'rgb(0, 255, 255)' : 'rgb(168, 85, 247)',
                              }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                x: [0, (Math.random() - 0.5) * 100],
                                y: [0, (Math.random() - 0.5) * 100],
                              }}
                              transition={{
                                duration: 0.8,
                                delay: i * 0.05,
                                ease: "easeOut",
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Ambient glow overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-purple-400/3 to-aqua-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    )}
                    
                    {isLoading === wallet.id ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-sm">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                      </div>
                    ) : null}
                    
                    <div className="flex flex-col items-center gap-3 relative z-10">
                      {/* Wallet Icon */}
                      <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center border border-white/20 group-hover:border-cyan-400/40 transition-colors duration-300">
                        <img 
                          src={wallet.icon} 
                          alt={`${wallet.name} logo`}
                          className="w-8 h-8 object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                        />
                      </div>
                      
                      {/* Wallet Name */}
                      <div className="text-center">
                        <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-cyan-100 transition-colors duration-300">{wallet.name}</h3>
                        <p className="text-cyan-400/60 text-xs font-light group-hover:text-cyan-300/80 transition-colors duration-300">{wallet.subtitle}</p>
                      </div>
                      
                      {/* Recommended Badge */}
                      {wallet.recommended && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full group-hover:from-cyan-400 group-hover:to-aqua-400 transition-all duration-300">
                          <span className="text-[10px] font-bold text-white">POPULAR</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Legal Links */}
              <div className="text-center space-y-3 pt-6 border-t border-white/10">
                <p className="text-xs text-cyan-200/60">
                  By connecting, you agree to our{' '}
                  <Link 
                    to="/terms" 
                    className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link 
                    to="/privacy" 
                    className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <p className="text-xs text-cyan-200/40">
                  <ShieldCheck className="inline w-3 h-3 mr-1" />
                  Your wallet is used only for authentication. We never access your funds.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-[11px] text-slate-600">
              By connecting, you agree to NovaFi's <br/>
              <a href="#" className="text-slate-500 hover:text-indigo-400 underline decoration-slate-700 hover:decoration-indigo-500/50 underline-offset-2">Terms</a> & <a href="#" className="text-slate-500 hover:text-indigo-400 underline decoration-slate-700 hover:decoration-indigo-500/50 underline-offset-2">Privacy Policy</a>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NovaFiWallet;