import { FiFileText } from 'react-icons/fi';
import CardDesign from '../components/CardDesign';

const dummyNotes = [
  { id: 'a1', title: 'Meeting Notes', snippet: 'Discuss project milestones...', createdAt: '2025-04-01' },
  { id: 'b2', title: 'Shopping List', snippet: 'Milk, Bread, Eggs...',           createdAt: '2025-04-05' },
  { id: 'c3', title: 'App Ideas',      snippet: 'New task manager app...',       createdAt: '2025-04-10' },
];

export default function AllNotesList() {
  return (
    <div>
      {/* <h2 className="text-2xl font-semibold mb-4">All Notes</h2> */}
              <h2 className="text-2xl text-black dark:text-gray-100 font-semibold mb-4">All Notes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyNotes.map(n => (
          <CardDesign
            key={n.id}
            id={n.id}
            icon={<FiFileText size={24} className="text-green-500 mr-2" />}
            title={n.title}
            description={n.snippet}
            createdAt={n.createdAt}
            onEdit={() => {console.log("file edited")}}
            onDelete={() => {console.log("file deleted")}}
            onClick={()=>{}}
          />
        ))}
      </div>
    </div>
  );
}
