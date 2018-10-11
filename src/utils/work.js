const work = {
  transitionStatus(str) {
    switch (str) {
      case "0":
        return "完成";

        break;
      case "1":
        return "生产中";

        break;
      case "2":
        return "暂停";

        break;
      case "3":
        return "未生产";

        break;
      case "4":
        return "关闭";
        break;
      case "5":
        return "未发出";
        break;
      case "6":
        return "已发出";
        break;
      case "7":
        return "已回厂";
        break;
      default:
        break;
    }
  },
  transitionSetPlanStatus(str) {
    switch (str) {
      case "0":
        return "检测中";

        break;
      case "1":
        return "检测完成";

        break;
      case "2":
        return "关闭";

        break;
      default:
        break;
    }
  },
}
export default work
