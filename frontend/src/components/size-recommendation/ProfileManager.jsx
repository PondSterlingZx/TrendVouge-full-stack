import React from 'react';
import useProfileStore from '../../stores/profileStore';

export const ProfileManager = () => {
  const { 
    profiles, 
    currentProfile, 
    addProfile, 
    updateProfile, 
    setCurrentProfile 
  } = useProfileStore();

  const [newProfileName, setNewProfileName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddProfile = () => {
    if (!newProfileName.trim()) return;
    
    addProfile({
      id: Date.now().toString(),
      name: newProfileName,
      measurements: {},
      dateCreated: new Date().toISOString()
    });

    setNewProfileName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">My Profiles</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-blue-600 text-sm"
        >
          Add Profile
        </button>
      </div>

      {isAdding && (
        <div className="p-4 border rounded-lg">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Profile name"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProfile}
              className="px-3 py-1 bg-black text-white rounded text-sm"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className={`p-4 border rounded-lg cursor-pointer
              ${currentProfile === profile.id ? 'border-blue-500 bg-blue-50' : ''}
            `}
            onClick={() => setCurrentProfile(profile.id)}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{profile.name}</div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(profile.dateUpdated).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateProfile(profile.id, {
                    dateUpdated: new Date().toISOString()
                  });
                }}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};