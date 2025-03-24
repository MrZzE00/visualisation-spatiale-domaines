import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { mainDomains, allDomains } from '../data/domains'

const Navigation = ({ domains, activeDomain, onDomainSelect, onDomainHover, onResetHover }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDomains, setFilteredDomains] = useState(domains)
  
  // Mettre à jour les domaines filtrés lorsque le terme de recherche change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDomains(domains)
      return
    }
    
    const searchResults = allDomains.filter(domain => {
      const includesSearchTerm = domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                domain.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Inclure également les sous-domaines dans la recherche
      const hasMatchingSubdomains = domain.subDomains?.some(
        subDomain => subDomain.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      return includesSearchTerm || hasMatchingSubdomains
    })
    
    setFilteredDomains(searchResults)
  }, [searchTerm, domains])
  
  // Fermer l'expansion lorsqu'un domaine est sélectionné
  useEffect(() => {
    if (activeDomain) {
      setIsExpanded(false)
    }
  }, [activeDomain])
  
  return (
    <div className="fixed left-4 top-4 z-50">
      <div 
        className={`bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg text-white overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-64 md:w-80' : 'w-12'
        }`}
      >
        {/* Bouton d'ouverture/fermeture */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
        >
          <div className="flex flex-col justify-center items-center gap-1.5">
            <span className="text-2xl leading-none">{isExpanded ? '✕' : '≡'}</span>
            {!isExpanded && (
              <div className="flex flex-col gap-1">
                <div className="w-4 h-0.5 bg-white"></div>
                <div className="w-4 h-0.5 bg-white"></div>
                <div className="w-4 h-0.5 bg-white"></div>
              </div>
            )}
          </div>
        </button>
        
        {/* Contenu du panneau */}
        <div 
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Champ de recherche */}
          <div className="p-3 border-b border-gray-700">
            <input
              type="text"
              placeholder="Rechercher un domaine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Liste des domaines */}
          <div className="max-h-[calc(70vh-60px)] overflow-y-auto">
            <div className="p-2">
              <h3 className="text-xs uppercase text-gray-400 mb-1 font-medium">Domaines principaux</h3>
              <ul className="space-y-1">
                {filteredDomains
                  .filter(domain => domain.type?.includes('Principal'))
                  .map(domain => (
                    <DomainButton
                      key={domain.id}
                      domain={domain}
                      isActive={activeDomain?.id === domain.id}
                      onDomainSelect={onDomainSelect}
                      onMouseEnter={() => onDomainHover(domain)}
                      onMouseLeave={onResetHover}
                    />
                  ))}
              </ul>
            </div>
            
            {searchTerm && (
              <div className="p-2 border-t border-gray-700">
                <h3 className="text-xs uppercase text-gray-400 mb-1 font-medium">Sous-domaines</h3>
                <ul className="space-y-1">
                  {filteredDomains
                    .filter(domain => !domain.type?.includes('Principal') || domain.type?.includes('Subdomain'))
                    .map(domain => (
                      <DomainButton
                        key={domain.id}
                        domain={domain}
                        isActive={activeDomain?.id === domain.id}
                        onDomainSelect={onDomainSelect}
                        onMouseEnter={() => onDomainHover(domain)}
                        onMouseLeave={onResetHover}
                        indent={domain.parentId ? true : false}
                      />
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Bouton pour un domaine individuel
const DomainButton = ({ domain, isActive, onDomainSelect, onMouseEnter, onMouseLeave, indent = false }) => {
  return (
    <li 
      className={`text-sm ${indent ? 'ml-3' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={() => onDomainSelect(domain.id)}
        className={`w-full text-left px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
          isActive 
            ? 'bg-blue-700 text-white' 
            : 'hover:bg-gray-800 text-gray-200'
        }`}
        style={{
          borderLeft: `3px solid ${domain.color || '#ffffff'}`
        }}
      >
        <span 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: domain.color || '#ffffff' }}
        />
        <span className="truncate">{domain.name}</span>
      </button>
    </li>
  )
}

export default Navigation 