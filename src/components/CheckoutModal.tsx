import React, { useState } from 'react';
import styles from './CheckoutModal.module.css';
import { X, CreditCard, CheckCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface CheckoutModalProps {
  course: {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ course, onClose, onSuccess }: CheckoutModalProps) {
  const { t } = useI18n();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Auto close after showing success for a bit
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} disabled={isProcessing || isSuccess}>
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className={styles.successState}>
            <CheckCircle size={64} className={styles.successIcon} />
            <h2>Payment Successful!</h2>
            <p>You now have access to {course.title}</p>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Secure Checkout</h2>
            
            <div className={styles.orderSummary}>
              <img src={course.thumbnail} alt={course.title} className={styles.thumbnail} />
              <div className={styles.orderDetails}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.price}>${course.price.toFixed(2)}</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleCheckout}>
              <div className={styles.formGroup}>
                <label>Name on Card</label>
                <input type="text" required placeholder="John Doe" />
              </div>
              
              <div className={styles.formGroup}>
                <label>Card Number</label>
                <div className={styles.inputIconWrapper}>
                  <CreditCard size={18} className={styles.inputIcon} />
                  <input type="text" required placeholder="0000 0000 0000 0000" className={styles.inputWithIcon} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Expiry</label>
                  <input type="text" required placeholder="MM/YY" />
                </div>
                <div className={styles.formGroup}>
                  <label>CVC</label>
                  <input type="text" required placeholder="123" />
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay $${course.price.toFixed(2)}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
