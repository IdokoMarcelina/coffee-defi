import { useState } from 'react'
import './App.css'
import { useWeb3 } from './contexts/Web3Context'
import BuyCoffeeModal from './components/BuyCoffeeModal'
import MemosList from './components/MemosList'

interface Coffee {
  id: number
  name: string
  price: number
  origin: string
  roastLevel: string
  available: number
}

function App() {
  const { account, balance, loading, error, connectWallet, disconnectWallet, withdrawTips, switchToLiskSepolia } = useWeb3()
  const [activeTab, setActiveTab] = useState<'buy' | 'memos' | 'farm' | 'rewards'>('buy')
  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showBuyModal, setShowBuyModal] = useState(false)

  const coffees: Coffee[] = [
    { id: 1, name: 'Ethiopian Arabica', price: 0.05, origin: 'Ethiopia', roastLevel: 'Medium', available: 100 },
    { id: 2, name: 'Colombian Supreme', price: 0.08, origin: 'Colombia', roastLevel: 'Dark', available: 75 },
    { id: 3, name: 'Brazilian Santos', price: 0.06, origin: 'Brazil', roastLevel: 'Light', available: 120 },
    { id: 4, name: 'Guatemalan Antigua', price: 0.09, origin: 'Guatemala', roastLevel: 'Medium-Dark', available: 60 },
  ]

  const handleBuy = () => {
    if (selectedCoffee) {
      setShowBuyModal(true)
    }
  }

  const handleWithdrawTips = async () => {
    try {
      await withdrawTips()
      alert('Tips withdrawn successfully!')
    } catch (error: any) {
      alert('Failed to withdraw tips: ' + error.message)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">☕ Coffee DeFi</h1>
        <div className="wallet-section">
          {!account ? (
            <button 
              className="connect-btn" 
              onClick={connectWallet}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="wallet-info">
              <span className="balance">ETH: {parseFloat(balance).toFixed(4)}</span>
              <div className="wallet-address">{account.slice(0, 6)}...{account.slice(-4)}</div>
              <button className="disconnect-btn" onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
          )}
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={`tab ${activeTab === 'buy' ? 'active' : ''}`}
          onClick={() => setActiveTab('buy')}
        >
          Buy Coffee
        </button>
        <button 
          className={`tab ${activeTab === 'memos' ? 'active' : ''}`}
          onClick={() => setActiveTab('memos')}
        >
          Purchase History
        </button>
        <button 
          className={`tab ${activeTab === 'farm' ? 'active' : ''}`}
          onClick={() => setActiveTab('farm')}
        >
          Farm Management
        </button>
        <button 
          className={`tab ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          Rewards
        </button>
      </nav>

      <main className="main-content">
        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            {error.includes('switch to Lisk Sepolia network') && (
              <button 
                className="network-switch-btn" 
                onClick={switchToLiskSepolia}
                disabled={loading}
              >
                {loading ? 'Switching...' : 'Add Lisk Sepolia Network to MetaMask'}
              </button>
            )}
          </div>
        )}
        
        {activeTab === 'buy' && (
          <div className="trading-section">
            <div className="coffee-grid">
              {coffees.map(coffee => (
                <div 
                  key={coffee.id} 
                  className={`coffee-card ${selectedCoffee?.id === coffee.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCoffee(coffee)}
                >
                  <h3 className="coffee-name">{coffee.name}</h3>
                  <div className="coffee-details">
                    <p><span className="label">Origin:</span> {coffee.origin}</p>
                    <p><span className="label">Roast:</span> {coffee.roastLevel}</p>
                    <p><span className="label">Price:</span> {coffee.price} ETH</p>
                    <p><span className="label">Available:</span> {coffee.available} units</p>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedCoffee && (
              <div className="trade-panel">
                <h3>{activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedCoffee.name}</h3>
                <div className="quantity-section">
                  <label htmlFor="quantity">Quantity:</label>
                  <div className="quantity-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input 
                      id="quantity"
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="trade-summary">
                  <p>Total: {(selectedCoffee.price * quantity).toFixed(4)} ETH</p>
                  <p>Gas Fee: ~0.002 ETH</p>
                </div>
                <button 
                  className="trade-btn"
                  onClick={handleBuy}
                  disabled={!account || loading}
                >
                  {loading ? 'Processing...' : 'Buy Coffee'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'memos' && (
          <MemosList />
        )}

        {activeTab === 'farm' && (
          <div className="farm-section">
            <div className="farm-stats">
              <div className="stat-card">
                <h3>Your Farm</h3>
                <p className="stat-value">2.5 acres</p>
                <p className="stat-label">Total Land</p>
              </div>
              <div className="stat-card">
                <h3>Coffee Plants</h3>
                <p className="stat-value">1,250</p>
                <p className="stat-label">Active Plants</p>
              </div>
              <div className="stat-card">
                <h3>Monthly Yield</h3>
                <p className="stat-value">85 kg</p>
                <p className="stat-label">Expected</p>
              </div>
              <div className="stat-card">
                <h3>Farm Value</h3>
                <p className="stat-value">12.5 ETH</p>
                <p className="stat-label">Current Worth</p>
              </div>
            </div>
            
            <div className="farm-actions">
              <button className="action-btn">Plant New Seeds</button>
              <button className="action-btn">Harvest Ready Crops</button>
              <button className="action-btn">Upgrade Equipment</button>
              <button 
                className="action-btn withdraw-btn" 
                onClick={handleWithdrawTips}
                disabled={!account || loading}
              >
                {loading ? 'Processing...' : 'Withdraw Tips (Owner Only)'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="rewards-section">
            <div className="rewards-summary">
              <div className="reward-card">
                <h3>Staking Rewards</h3>
                <p className="reward-amount">15.4 COFFEE</p>
                <button className="claim-btn">Claim</button>
              </div>
              <div className="reward-card">
                <h3>Farming Rewards</h3>
                <p className="reward-amount">8.2 COFFEE</p>
                <button className="claim-btn">Claim</button>
              </div>
              <div className="reward-card">
                <h3>Trading Fees</h3>
                <p className="reward-amount">0.05 ETH</p>
                <button className="claim-btn">Claim</button>
              </div>
            </div>
            
            <div className="staking-section">
              <h3>Stake COFFEE Tokens</h3>
              <div className="staking-controls">
                <input type="number" placeholder="Amount to stake" className="stake-input" />
                <button className="stake-btn">Stake Tokens</button>
              </div>
              <div className="staking-info">
                <p>Current APY: 12.5%</p>
                <p>Your Staked: 100 COFFEE</p>
                <p>Rewards Earned: 15.4 COFFEE</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BuyCoffeeModal
        coffeeName={selectedCoffee?.name || ''}
        coffeePrice={selectedCoffee?.price || 0}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onSuccess={() => {
          // Refresh any data if needed
        }}
      />
    </div>
  )
}

export default App
