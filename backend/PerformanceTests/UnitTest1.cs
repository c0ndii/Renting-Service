using NBomber.CSharp;
using NBomber.Http.CSharp;
using Xunit.Abstractions;
using Xunit;


namespace PerformanceTests
{
    public class PerformanceTests
    {
        private readonly ITestOutputHelper _outputHelper;
        [Fact]
        public void get_mapposts_should_handle_at_least_100_requests_per_second()
        {
            var httpClient = new HttpClient();
            const string url = "https://localhost:7112/api/post/posts/map?PostType=rent&northEastLat=53.14378447779318&northEastLng=23.18990707397461&southWestLat=53.12282618651035&southWestLng=23.1178092956543";
            const int rate = 200;
            const int duration = 120;
            var scenario = Scenario.Create("get_map_posts", async context =>
            {
                var request = Http.CreateRequest("GET", url);
                var response = await Http.Send(httpClient, request);
                return response;

            }).WithLoadSimulations(
                    Simulation.Inject(
                        rate: rate,
                        interval: TimeSpan.FromSeconds(1),
                        during: TimeSpan.FromSeconds(duration)));
            var stats = NBomberRunner.RegisterScenarios(scenario)
                .Run();
            var scenarioStats = stats.ScenarioStats[0];
            _outputHelper.WriteLine($"OK {stats.AllOkCount}, FAILED: {stats.AllFailCount}");

            Assert.True(stats.AllOkCount >= duration * rate, "Too slow");
        }

        //[Fact]
        //public void get_listposts_should_handle_at_least_100_requests_per_second()
        //{
        //    var httpClient = new HttpClient();
        //    const string url = "https://localhost:7112/api/post/posts/list?PageNumber=1&PageSize=10&SortBy=AddDate&SortDirection=1&PostType=rent";
        //    const int rate = 20;
        //    const int duration = 40;
        //    var scenario = Scenario.Create("get_list_posts", async context =>
        //    {
        //        var request = Http.CreateRequest("GET", url);
        //        var response = await Http.Send(httpClient, request);
        //        return response;

        //    }).WithLoadSimulations(
        //            Simulation.Inject(
        //                rate: rate,
        //                interval: TimeSpan.FromSeconds(1),
        //                during: TimeSpan.FromSeconds(duration)));
        //    var stats = NBomberRunner.RegisterScenarios(scenario)
        //        .Run();
        //    var scenarioStats = stats.ScenarioStats[0];
        //    _outputHelper.WriteLine($"OK {stats.AllOkCount}, FAILED: {stats.AllFailCount}");

        //    Assert.True(stats.AllOkCount >= duration * rate, "Too slow");
        //}
        public PerformanceTests(ITestOutputHelper outputHelper)
        {
            _outputHelper = outputHelper;
        }
    }
}