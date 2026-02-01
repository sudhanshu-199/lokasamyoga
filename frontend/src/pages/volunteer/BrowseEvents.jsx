import EventCard from "../../components/EventCard";

const BrowseEvents = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Available Events</h1>

      <EventCard />
      <EventCard />
    </div>
  );
};

export default BrowseEvents;
