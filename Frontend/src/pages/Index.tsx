import RentPredictionForm from "@/components/RentPredictionForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-8 -left-4 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>


      <div className="container py-8 md:py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Predict Your Property's Rental Value
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your property details below and get an instant estimate of its
            nightly rental price based on market data and amenities.
          </p>
        </div>
        <RentPredictionForm />
      </div>
    </div>
  );
};

export default Index;