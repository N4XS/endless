import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MotionWrapper } from "@/components/MotionWrapper";
import { pageTransition } from "@/lib/motion";
import { Suspense, lazy } from "react";

// Code splitting avec React.lazy
const Index = lazy(() => import("@/pages/Index"));
const Tentes = lazy(() => import("@/pages/Tentes"));
const Location = lazy(() => import("@/pages/Location"));
const Contact = lazy(() => import("@/pages/Contact"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Auth = lazy(() => import("@/pages/Auth"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("@/pages/PaymentCancelled"));
const PaymentError = lazy(() => import("@/pages/PaymentError"));
const MentionsLegales = lazy(() => import("@/pages/MentionsLegales"));
const CGV = lazy(() => import("@/pages/CGV"));
const PolitiqueConfidentialite = lazy(() => import("@/pages/PolitiqueConfidentialite"));
const Garantie = lazy(() => import("@/pages/Garantie"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <MotionWrapper
    variants={pageTransition}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    {children}
  </MotionWrapper>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
          <Route path="/tentes" element={<PageWrapper><Tentes /></PageWrapper>} />
          <Route path="/location" element={<PageWrapper><Location /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
          <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
          <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
          <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
          <Route path="/payment-success" element={<PageWrapper><PaymentSuccess /></PageWrapper>} />
          <Route path="/payment-cancelled" element={<PageWrapper><PaymentCancelled /></PageWrapper>} />
          <Route path="/payment-error" element={<PageWrapper><PaymentError /></PageWrapper>} />
          <Route path="/mentions-legales" element={<PageWrapper><MentionsLegales /></PageWrapper>} />
          <Route path="/cgv" element={<PageWrapper><CGV /></PageWrapper>} />
          <Route path="/politique-confidentialite" element={<PageWrapper><PolitiqueConfidentialite /></PageWrapper>} />
          <Route path="/garantie" element={<PageWrapper><Garantie /></PageWrapper>} />
          <Route path="/blog" element={<PageWrapper><div>Page Blog - À venir</div></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};