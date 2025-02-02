import Banner from "./components/Banner";
import Storage from "./components/Storage";

const ProfileOverview = () => {
  return (
    <div className="mx-auto flex w-full flex-col  justify-center gap-5 sm:flex-row ">
      <div className=" mt-3 sm:w-1/2 ">
        <div className=" lg:!mb-0">
          <Banner />
        </div>
      </div>
      <div className="col-span-3 lg:!mb-0">
        <Storage />
      </div>
    </div>
  );
};

export default ProfileOverview;
