import nft1 from "@/assets/img/nfts/NftBanner2.png";

const Banner = () => {
  return (
    <div
      className="flex w-full flex-col rounded-[20px] bg-cover px-[30px] py-[30px] md:px-[64px] md:py-[56px]"
      style={{ backgroundImage: `url(${nft1})` }}
    >
      <div className="w-full">
        <h4 className="mb-[14px] max-w-full text-xl font-bold text-white md:w-[64%] md:text-3xl md:leading-[42px] lg:w-[46%] xl:w-[85%] 2xl:w-[75%] 3xl:w-[52%]">
          View what students are learning by filtering with term and class.. to
          view click on the eye icon top right
        </h4>
      </div>
    </div>
  );
};

export default Banner;
