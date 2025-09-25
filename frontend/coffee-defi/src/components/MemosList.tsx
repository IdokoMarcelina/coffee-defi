import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';

interface Memo {
  from: string;
  to: string;
  timestamp: bigint;
  name: string;
  message: string;
}

const MemosList: React.FC = () => {
  const { getMemos, contract } = useWeb3();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemos = async () => {
    try {
      setLoading(true);
      const memosData = await getMemos();
      setMemos(memosData.reverse()); // Show latest first
    } catch (error) {
      console.error('Error fetching memos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchMemos();
      
      // Listen for new memo events
      const handleNewMemo = () => {
        fetchMemos();
      };

      contract.on('NewMemo', handleNewMemo);

      return () => {
        contract.off('NewMemo', handleNewMemo);
      };
    }
  }, [contract]);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="memos-loading">
        <p>Loading coffee purchases...</p>
      </div>
    );
  }

  if (memos.length === 0) {
    return (
      <div className="memos-empty">
        <p>No coffee purchases yet. Be the first to buy a coffee!</p>
      </div>
    );
  }

  return (
    <div className="memos-list">
      <h3>Recent Coffee Purchases</h3>
      <div className="memos-grid">
        {memos.map((memo, index) => (
          <div key={index} className="memo-card">
            <div className="memo-header">
              <span className="memo-name">{memo.name}</span>
              <span className="memo-date">{formatDate(memo.timestamp)}</span>
            </div>
            <p className="memo-message">{memo.message}</p>
            <div className="memo-footer">
              <span className="memo-address">
                From: {truncateAddress(memo.from)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemosList;