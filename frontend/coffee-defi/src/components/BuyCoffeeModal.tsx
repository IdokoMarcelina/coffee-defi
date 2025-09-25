import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

interface BuyCoffeeModalProps {
  coffeeName: string;
  coffeePrice: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BuyCoffeeModal: React.FC<BuyCoffeeModalProps> = ({
  coffeeName,
  coffeePrice,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { buyCoffee, loading, account } = useWeb3();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(coffeePrice.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    if (!name.trim() || !message.trim()) {
      alert('Please fill in both name and message');
      return;
    }

    try {
      await buyCoffee(name, `${message} (${coffeeName})`, amount);
      alert('Coffee purchased successfully!');
      onSuccess();
      onClose();
      setName('');
      setMessage('');
      setAmount(coffeePrice.toString());
    } catch (error: any) {
      console.error('Error buying coffee:', error);
      alert('Failed to buy coffee: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Buy {coffeeName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="buy-coffee-form">
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a nice message..."
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (ETH):</label>
            <input
              id="amount"
              type="number"
              step="0.001"
              min="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="transaction-summary">
            <p>Coffee: {coffeeName}</p>
            <p>Amount: {amount} ETH</p>
            <p>Gas Fee: ~0.002 ETH</p>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              className="buy-btn" 
              disabled={loading || !account}
            >
              {loading ? 'Processing...' : 'Buy Coffee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyCoffeeModal;