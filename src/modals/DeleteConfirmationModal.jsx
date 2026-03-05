import { AlertCircle } from 'lucide-react'
import React from 'react'

const DeleteConfirmationModal = ({heading,message,onclose,isDeleting,NotDeleteLabel,handleDelete,DeleteLabel,LoadingMessage}) => {
  return (
    <div>
       <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-in fade-in zoom-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{heading}?</h3>
            <p className="text-gray-600 mb-6">
             {message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onclose}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {NotDeleteLabel}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-red-600 rounded-full animate-spin"></div>
                    {LoadingMessage}...
                  </>
                ) : (
                    <>{DeleteLabel}</>
                  
                )}
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default DeleteConfirmationModal
