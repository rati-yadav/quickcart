import { useEffect, useState } from 'react'

import { Link, useSearchParams } from 'react-router-dom'

import { api } from '../api/client'

import { ProductCard } from '../components/ProductCard'

import { useLanguage } from '../context/LanguageContext'

import '../styles/searchPage.css'

import '../styles/features.css'



const CATEGORY_OPTIONS = [

  { label: 'All', value: '' },

  { label: 'Electronics', value: 'Electronics' },

  { label: 'Fashion', value: 'Fashion' },

  { label: 'Home', value: 'Home' },

  { label: 'Kitchen', value: 'Kitchen' },

  { label: 'Sports', value: 'Sports' },

  { label: 'Stationery', value: 'Stationery' },

  { label: 'Gifts', value: 'Gifts' },

  { label: 'Health', value: 'Health' },

]



const SORT_OPTIONS = [

  { value: '', labelKey: 'sortDefault' },

  { value: 'price_asc', labelKey: 'sortPriceAsc' },

  { value: 'price_desc', labelKey: 'sortPriceDesc' },

  { value: 'rating', labelKey: 'sortRating' },

]



export function SearchPage() {

  const { t, tCategory } = useLanguage()

  const [params, setParams] = useSearchParams()

  const q = params.get('q') || ''

  const category = params.get('category') || ''

  const minPrice = params.get('min_price') || ''

  const maxPrice = params.get('max_price') || ''

  const sort = params.get('sort') || ''

  const [draftMin, setDraftMin] = useState(minPrice)

  const [draftMax, setDraftMax] = useState(maxPrice)

  const [draftSort, setDraftSort] = useState(sort)

  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')



  useEffect(() => {

    setDraftMin(minPrice)

    setDraftMax(maxPrice)

    setDraftSort(sort)

  }, [minPrice, maxPrice, sort])



  useEffect(() => {

    setLoading(true)

    setError('')

    const query = new URLSearchParams()

    if (q) query.set('q', q)

    if (category) query.set('category', category)

    if (minPrice) query.set('min_price', minPrice)

    if (maxPrice) query.set('max_price', maxPrice)

    if (sort) query.set('sort', sort)

    const qs = query.toString()

    api(`/products/${qs ? `?${qs}` : ''}`)

      .then((data) => setProducts(data.results ?? data))

      .catch(() => setError('Search failed. Is the API running?'))

      .finally(() => setLoading(false))

  }, [q, category, minPrice, maxPrice, sort])



  function updateCategory(value) {

    const next = new URLSearchParams(params)

    if (value) next.set('category', value)

    else next.delete('category')

    setParams(next)

  }



  function applyFilters(e) {

    e.preventDefault()

    const next = new URLSearchParams(params)

    if (draftMin) next.set('min_price', draftMin)

    else next.delete('min_price')

    if (draftMax) next.set('max_price', draftMax)

    else next.delete('max_price')

    if (draftSort) next.set('sort', draftSort)

    else next.delete('sort')

    setParams(next)

  }



  const countLabel =

    products.length === 1 ? t('resultsCount', { n: products.length }) : t('resultsCountPlural', { n: products.length })



  return (

    <div className="search-page">

      <div className="search-page-header">

        <h1>

          {q ? (

            <>

              {t('searchResults', { q })}

              {category ? t('inCategory', { cat: tCategory(category) }) : ''}

            </>

          ) : (

            <>

              {t('browseProducts')}

              {category ? ` · ${tCategory(category)}` : ''}

            </>

          )}

        </h1>

        <p className="search-page-count">{loading ? t('searching') : countLabel}</p>

        <div className="search-filters">

          {CATEGORY_OPTIONS.map((opt) => (

            <button

              key={opt.label}

              type="button"

              className={`search-filter-chip ${category === opt.value ? 'active' : ''}`}

              onClick={() => updateCategory(opt.value)}

            >

              {opt.label === 'All' ? t('all') : tCategory(opt.value)}

            </button>

          ))}

        </div>



        <form className="search-price-filters" onSubmit={applyFilters}>

          <span>{t('filterPrice')}</span>

          <label>

            {t('minPrice')}

            <input

              type="number"

              min="0"

              value={draftMin}

              onChange={(e) => setDraftMin(e.target.value)}

            />

          </label>

          <label>

            {t('maxPrice')}

            <input

              type="number"

              min="0"

              value={draftMax}

              onChange={(e) => setDraftMax(e.target.value)}

            />

          </label>

          <label>

            {t('sortBy')}

            <select value={draftSort} onChange={(e) => setDraftSort(e.target.value)}>

              {SORT_OPTIONS.map((opt) => (

                <option key={opt.value || 'default'} value={opt.value}>

                  {t(opt.labelKey)}

                </option>

              ))}

            </select>

          </label>

          <button type="submit" className="search-filter-apply">

            {t('applyFilters')}

          </button>

        </form>

      </div>



      {error ? <p className="search-error">{error}</p> : null}



      {!loading && !products.length && !error ? (

        <div className="search-empty">

          <p>{t('noProducts')}</p>

          <Link to="/">{t('continueShopping')}</Link>

        </div>

      ) : null}



      <div className="search-results products-deals">

        {products.map((p) => (

          <ProductCard key={p.id} product={p} />

        ))}

      </div>

    </div>

  )

}

