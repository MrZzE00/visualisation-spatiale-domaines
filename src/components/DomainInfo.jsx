import React, { useEffect, useState } from 'react'
import { getLinkedDomains, getChildDomains } from '../data/domains'

const DomainInfo = ({ domain, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('description')
  const [relatedDomains, setRelatedDomains] = useState([])
  const [childDomains, setChildDomains] = useState([])
  
  // Récupérer les domaines liés lorsque le domaine change
  useEffect(() => {
    if (domain) {
      const linked = getLinkedDomains(domain.id)
      const children = getChildDomains(domain.id)
      
      setRelatedDomains(linked)
      setChildDomains(children)
    }
  }, [domain])
  
  if (!domain) return null
  
  // Récupérer les types de domaine formatés pour l'affichage
  const domainTypes = domain.type?.split(',').map(type => type.trim()) || ['Standard']
  
  // Récupérer les liens structurés pour l'affichage
  const structuredLinks = domain.links?.map(link => ({
    id: link.id,
    name: link.name,
    verb: link.verb || 'connecté à'
  })) || []
  
  return (
    <div 
      className={`fixed right-0 top-0 h-full w-full md:w-[450px] bg-black/90 backdrop-blur-md border-l border-gray-800 text-white overflow-auto z-40 transition-all duration-500 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* En-tête */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: domain.color || '#ffffff' }}
          ></span>
          {domain.name}
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
      
      {/* Navigation par onglets */}
      <div className="flex border-b border-gray-800">
        <button
          className={`px-4 py-3 text-sm font-medium flex-1 ${
            activeTab === 'description' 
              ? 'border-b-2 border-blue-500 text-blue-400' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium flex-1 ${
            activeTab === 'connections' 
              ? 'border-b-2 border-blue-500 text-blue-400' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
          onClick={() => setActiveTab('connections')}
        >
          Connexions
        </button>
        {childDomains.length > 0 && (
          <button
            className={`px-4 py-3 text-sm font-medium flex-1 ${
              activeTab === 'subdomains' 
                ? 'border-b-2 border-blue-500 text-blue-400 font-bold' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
            onClick={() => setActiveTab('subdomains')}
          >
            Sous-domaines
          </button>
        )}
      </div>
      
      {/* Contenu */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div>
            {/* Types de domaine */}
            <div className="mb-4">
              <h3 className="text-xs uppercase text-gray-400 mb-2">Type</h3>
              <div className="flex flex-wrap gap-2">
                {domainTypes.map((type, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full ${
                      type.includes('Principal')
                        ? 'bg-yellow-800/30 text-yellow-400 border border-yellow-700'
                        : 'bg-blue-800/30 text-blue-400 border border-blue-700'
                    }`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-400 mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {domain.description || "Aucune description disponible pour ce domaine."}
              </p>
            </div>
            
            {/* Propriétés */}
            {domain.properties && Object.keys(domain.properties).length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs uppercase text-gray-400 mb-2">Propriétés</h3>
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(domain.properties).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-800 last:border-0">
                          <td className="py-2 px-3 font-medium text-gray-400">{key}</td>
                          <td className="py-2 px-3 text-white">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Caractéristiques visuelles */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-xs uppercase text-gray-400 mb-2">Couleur</h3>
                <div className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded border border-gray-700 mr-2" 
                    style={{ backgroundColor: domain.color || '#ffffff' }}
                  ></div>
                  <span>{domain.color || '#ffffff'}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs uppercase text-gray-400 mb-2">Taille</h3>
                <div className="flex items-center">
                  <svg 
                    className="w-6 h-6 mr-2 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r={5 + (domain.size || 1) * 2} strokeWidth="1" />
                  </svg>
                  <span>{domain.size || 1}</span>
                </div>
              </div>
            </div>
            
            {/* Textures */}
            {domain.textures && (
              <div>
                <h3 className="text-xs uppercase text-gray-400 mb-2">Apparence</h3>
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
                  <div className="flex flex-wrap gap-4">
                    {domain.textures.surface && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-2">Surface:</span>
                        <span className="text-sm">{domain.textures.surface}</span>
                      </div>
                    )}
                    {domain.textures.atmosphere && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-2">Atmosphère:</span>
                        <span className="text-sm">{domain.textures.atmosphere}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'connections' && (
          <div>
            <h3 className="text-xs uppercase text-gray-400 mb-2">Connexions</h3>
            
            {/* Connexions sortantes */}
            {structuredLinks.length > 0 ? (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Relations sortantes</h4>
                <div className="space-y-2">
                  {structuredLinks.map((link, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-900/60 border border-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{link.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {domain.name} <span className="text-blue-400">{link.verb}</span> {link.name}
                        </div>
                      </div>
                      <svg 
                        className="w-5 h-5 text-gray-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-lg text-gray-400 mb-6">
                Aucune connexion sortante définie pour ce domaine.
              </div>
            )}
            
            {/* Connexions entrantes */}
            {relatedDomains.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium mb-2">Relations entrantes</h4>
                <div className="space-y-2">
                  {relatedDomains.map((relatedDomain, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-900/60 border border-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{relatedDomain.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {relatedDomain.name} <span className="text-blue-400">
                            {relatedDomain.links?.find(link => link.id === domain.id)?.verb || 'connecté à'}
                          </span> {domain.name}
                        </div>
                      </div>
                      <svg 
                        className="w-5 h-5 text-gray-500 transform rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-lg text-gray-400">
                Aucune connexion entrante vers ce domaine.
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'subdomains' && childDomains.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-4">SOUS-DOMAINES</h3>
            <div className="space-y-5">
              {childDomains.map(child => (
                <div 
                  key={child.id}
                  className="p-5 bg-gray-900/80 border border-gray-800 rounded-lg"
                >
                  <div className="flex items-center mb-3">
                    <span 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: child.color || '#ffffff' }}
                    ></span>
                    <h4 className="font-bold text-lg">{child.name}</h4>
                  </div>
                  {child.description && (
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {child.description}
                    </p>
                  )}
                  
                  {/* Afficher les informations détaillées si disponibles */}
                  {child.detailedInfo && child.detailedInfo.length > 0 && (
                    <div className="space-y-4 mt-4">
                      {child.detailedInfo.map((info, index) => (
                        <div key={index} className="border-t border-gray-800 pt-4 first:border-t-0 first:pt-0">
                          <h5 className="font-bold text-white mb-1">{info.title}</h5>
                          <p className="text-gray-300">{info.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DomainInfo 