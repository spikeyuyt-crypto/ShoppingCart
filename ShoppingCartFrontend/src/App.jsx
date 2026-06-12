import { useMemo, useState } from 'react'
import './App.css'
import heroImage from './assets/hero.png'

const products = [
  {
    id: 1,
    name: '无线蓝牙耳机',
    description: '轻巧入耳，适合通勤和运动。',
    price: 199,
    category: '数码',
    color: '#e9f6ff',
    accent: '#2f80ed',
    image: '🎧',
  },
  {
    id: 2,
    name: '便携保温杯',
    description: '316 不锈钢内胆，冷热都能装。',
    price: 89,
    category: '生活',
    color: '#fff1df',
    accent: '#d97706',
    image: '🥤',
  },
  {
    id: 3,
    name: '棉质休闲 T 恤',
    description: '柔软透气，日常穿搭很省心。',
    price: 129,
    category: '服饰',
    color: '#edf7ed',
    accent: '#2f855a',
    image: '👕',
  },
  {
    id: 4,
    name: '桌面收纳盒',
    description: '分格收纳，保持桌面清爽。',
    price: 59,
    category: '家居',
    color: '#f3edff',
    accent: '#7c3aed',
    image: '🗂️',
  },
  {
    id: 5,
    name: '机械键盘',
    description: '清脆手感，适合学习和办公。',
    price: 299,
    category: '数码',
    color: '#f1f5f9',
    accent: '#334155',
    image: '⌨️',
  },
  {
    id: 6,
    name: '香薰蜡烛',
    description: '柔和木质香，放松睡前时光。',
    price: 79,
    category: '生活',
    color: '#fff7ed',
    accent: '#ea580c',
    image: '🕯️',
  },
]

function formatPrice(price) {
  return `¥${price.toFixed(2)}`
}

export default function App() {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  )

  function addToCart(product) {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id)

      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...items, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
    setOrderMessage('')
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setCartItems((items) =>
      items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    )
    setOrderMessage('')
  }

  function removeFromCart(productId) {
    setCartItems((items) => items.filter((item) => item.id !== productId))
    setOrderMessage('')
  }

  function submitOrder() {
    if (cartItems.length === 0) {
      setOrderMessage('购物车还是空的，先挑几件商品吧。')
      return
    }

    setOrderMessage(`订单提交成功，共 ${cartCount} 件商品，合计 ${formatPrice(cartTotal)}。`)
    setCartItems([])
  }

  return (
    <main className="shopping-page">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Simple React Shop</p>
          <h1>React 购物商店</h1>
          <p className="hero__text">浏览商品、加入购物车、修改数量并提交订单。</p>
        </div>
      </section>

      <section className="product-section" aria-labelledby="product-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Products</p>
            <h2 id="product-title">商品浏览</h2>
          </div>
          <span>{products.length} 件商品</span>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-card__image" style={{ backgroundColor: product.color }}>
                <span aria-hidden="true">{product.image}</span>
              </div>
              <div className="product-card__body">
                <span className="tag" style={{ color: product.accent }}>
                  {product.category}
                </span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-card__footer">
                  <strong>{formatPrice(product.price)}</strong>
                  <button type="button" onClick={() => addToCart(product)}>
                    加入购物车
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isCartOpen && (
        <button
          className="cart-backdrop"
          type="button"
          aria-label="关闭购物车"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <aside className={`cart-panel ${isCartOpen ? 'cart-panel--open' : ''}`} aria-label="购物车">
        <div className="cart-panel__header">
          <div>
            <p className="eyebrow">Cart</p>
            <h2>我的购物车</h2>
          </div>
          <button className="icon-button" type="button" onClick={() => setIsCartOpen(false)}>
            ×
          </button>
        </div>

        <div className="cart-panel__items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>购物车为空</p>
              <span>点击商品卡片上的“加入购物车”开始选购。</span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item__icon" style={{ backgroundColor: item.color }}>
                  <span aria-hidden="true">{item.image}</span>
                </div>
                <div className="cart-item__info">
                  <h3>{item.name}</h3>
                  <p>{formatPrice(item.price)}</p>
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      aria-label={`${item.name} 数量`}
                      min="1"
                      type="number"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="remove-button" type="button" onClick={() => removeFromCart(item.id)}>
                  删除
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-panel__footer">
          <div className="cart-total">
            <span>合计</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>
          <button className="checkout-button" type="button" onClick={submitOrder}>
            提交订单
          </button>
          {orderMessage && <p className="order-message">{orderMessage}</p>}
        </div>
      </aside>

      <button className="floating-cart" type="button" onClick={() => setIsCartOpen(true)}>
        <span>购物车</span>
        <strong>{cartCount}</strong>
      </button>
    </main>
  )
}
