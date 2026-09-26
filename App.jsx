import { useCallback, useEffect, useState } from 'react';
import { WalletProvider } from './hooks/useWallet.jsx';
import ShaderBackground from './components/ShaderBackground.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import PerformanceSection from './components/PerformanceSection.jsx';
import SecuritySection from './components/SecuritySection.jsx';
import WhySection from './components/WhySection.jsx';
import ReviewsSection from './components/ReviewsSection.jsx';
import CtaSection from './components/CtaSection.jsx';
import Footer from './components/Footer.jsx';
import ApplyModal from './components/ApplyModal.jsx';
import WaterCursorFx from './components/WaterCursorFx.jsx';

export default function App(){
  const [applyOpen, setApplyOpen] = useState(location.hash === '#apply');

  const openApply = useCallback((pushHistory = true) => {
    setApplyOpen(true);
    if(pushHistory) history.pushState({ apply: true }, '', '#apply');
  }, []);

  const closeApply = useCallback((popHistory = true) => {
    setApplyOpen(false);
    if(popHistory && location.hash === '#apply') history.back();
  }, []);

  useEffect(() => {
    function onPopState(){
      if(location.hash === '#apply') openApply(false);
      else closeApply(false);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [openApply, closeApply]);

  return (
    <WalletProvider>
      <ShaderBackground className="app-shader-bg" />
      <Header onApplyOpen={() => openApply(true)} />
      <Hero onApplyOpen={() => openApply(true)} />
      <PerformanceSection />
      <SecuritySection />
      <WhySection />
      <ReviewsSection />
      <CtaSection onApplyOpen={() => openApply(true)} />
      <Footer onApplyOpen={() => openApply(true)} />
      <ApplyModal open={applyOpen} onClose={() => closeApply(true)} />
      <WaterCursorFx />
    </WalletProvider>
  );
}
