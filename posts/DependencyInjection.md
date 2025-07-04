---
title: "C# 依赖注入完全指南"
date: "2025-07-01"
excerpt: "深入理解 .NET 依赖注入容器、生命周期管理和最佳实践"
subcategory: 'csharp'
category: "tech"
---

# C# 依赖注入完全指南

## 📖 目录
- [依赖注入基础概念](#依赖注入基础概念)
- [服务生命周期详解](#服务生命周期详解)
- [容器注册与实例化](#容器注册与实例化)
- [高级依赖注入技术](#高级依赖注入技术)
- [实际应用场景](#实际应用场景)
- [性能优化](#性能优化)
- [最佳实践](#最佳实践)

---

## 依赖注入基础概念

### 🔍 什么是依赖注入
依赖注入（Dependency Injection, DI）是一种设计模式，用于实现控制反转（IoC），将对象的依赖关系从内部创建转移到外部注入。

```csharp
// 传统方式：紧耦合
public class OrderService
{
    private readonly EmailService _emailService;
    
    public OrderService()
    {
        _emailService = new EmailService(); // 紧耦合
    }
    
    public void ProcessOrder(Order order)
    {
        // 处理订单
        _emailService.SendConfirmation(order);
    }
}

// 依赖注入方式：松耦合
public class OrderService
{
    private readonly IEmailService _emailService;
    
    public OrderService(IEmailService emailService)
    {
        _emailService = emailService; // 通过构造函数注入
    }
    
    public void ProcessOrder(Order order)
    {
        // 处理订单
        _emailService.SendConfirmation(order);
    }
}
```

### 🏗️ 依赖注入的优势
```csharp
// 1. 可测试性
public class OrderServiceTests
{
    [Test]
    public void ProcessOrder_ShouldSendEmail()
    {
        // 使用模拟对象
        var mockEmailService = new Mock<IEmailService>();
        var orderService = new OrderService(mockEmailService.Object);
        
        orderService.ProcessOrder(new Order());
        
        mockEmailService.Verify(x => x.SendConfirmation(It.IsAny<Order>()), Times.Once);
    }
}

// 2. 可配置性
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // 可以轻松切换实现
        services.AddScoped<IEmailService, EmailService>(); // 生产环境
        // services.AddScoped<IEmailService, MockEmailService>(); // 测试环境
    }
}
```

---

## 服务生命周期详解

### ⏳ 三种主要生命周期
.NET 依赖注入容器提供三种主要的生命周期管理方式：

#### 1. 🔄 Transient（瞬态）
每次请求都创建新实例。

```csharp
public interface ITransientService
{
    Guid GetId();
}

public class TransientService : ITransientService
{
    private readonly Guid _id;
    
    public TransientService()
    {
        _id = Guid.NewGuid();
        Console.WriteLine($"创建 TransientService 实例: {_id}");
    }
    
    public Guid GetId() => _id;
}

// 注册
services.AddTransient<ITransientService, TransientService>();

// 使用演示
public class TransientDemo
{
    public void Demonstrate(IServiceProvider serviceProvider)
    {
        var service1 = serviceProvider.GetService<ITransientService>();
        var service2 = serviceProvider.GetService<ITransientService>();
        
        Console.WriteLine($"Service1 ID: {service1.GetId()}");
        Console.WriteLine($"Service2 ID: {service2.GetId()}");
        // 输出：两个不同的 GUID
    }
}
```

#### 2. 🔒 Singleton（单例）
整个应用程序生命周期内只创建一个实例。

```csharp
public interface ISingletonService
{
    Guid GetId();
    int GetRequestCount();
}

public class SingletonService : ISingletonService
{
    private readonly Guid _id;
    private int _requestCount;
    
    public SingletonService()
    {
        _id = Guid.NewGuid();
        Console.WriteLine($"创建 SingletonService 实例: {_id}");
    }
    
    public Guid GetId() => _id;
    
    public int GetRequestCount() => Interlocked.Increment(ref _requestCount);
}

// 注册
services.AddSingleton<ISingletonService, SingletonService>();

// 使用演示
public class SingletonDemo
{
    public void Demonstrate(IServiceProvider serviceProvider)
    {
        var service1 = serviceProvider.GetService<ISingletonService>();
        var service2 = serviceProvider.GetService<ISingletonService>();
        
        Console.WriteLine($"Service1 ID: {service1.GetId()}");
        Console.WriteLine($"Service2 ID: {service2.GetId()}");
        // 输出：相同的 GUID
        
        Console.WriteLine($"Request count: {service1.GetRequestCount()}");
        Console.WriteLine($"Request count: {service2.GetRequestCount()}");
        // 输出：1, 2（共享状态）
    }
}
```

#### 3. 🎯 Scoped（作用域）
在同一个作用域内共享同一个实例。

```csharp
public interface IScopedService
{
    Guid GetId();
}

public class ScopedService : IScopedService
{
    private readonly Guid _id;
    
    public ScopedService()
    {
        _id = Guid.NewGuid();
        Console.WriteLine($"创建 ScopedService 实例: {_id}");
    }
    
    public Guid GetId() => _id;
}

// 注册
services.AddScoped<IScopedService, ScopedService>();

// 使用演示
public class ScopedDemo
{
    public void Demonstrate(IServiceProvider serviceProvider)
    {
        using (var scope1 = serviceProvider.CreateScope())
        {
            var service1a = scope1.ServiceProvider.GetService<IScopedService>();
            var service1b = scope1.ServiceProvider.GetService<IScopedService>();
            
            Console.WriteLine($"Scope1 - Service1a ID: {service1a.GetId()}");
            Console.WriteLine($"Scope1 - Service1b ID: {service1b.GetId()}");
            // 输出：相同的 GUID
        }
        
        using (var scope2 = serviceProvider.CreateScope())
        {
            var service2 = scope2.ServiceProvider.GetService<IScopedService>();
            Console.WriteLine($"Scope2 - Service2 ID: {service2.GetId()}");
            // 输出：不同的 GUID
        }
    }
}
```

---

## 容器注册与实例化

### 📝 依赖注入注册后，等需要用到后才会实例化

```csharp
public interface INumberService
{
    int GetNumber();
}

public class NumberService : INumberService
{
    public NumberService()
    {
        Console.WriteLine($"创建 {nameof(NumberService)} 实例");
    }
    
    public int GetNumber() => Random.Shared.Next(1, 100);
}

public interface IServiceA
{
    void A();
}

public class ServiceA : IServiceA, IDisposable
{
    private readonly int _n;
    
    public ServiceA(INumberService numberService)
    {
        _n = numberService.GetNumber();
        Console.WriteLine($"ctor {nameof(ServiceA)}, {_n}");
    }

    public void A() => Console.WriteLine($"{nameof(A)}, {_n}");
    
    public void Dispose() => Console.WriteLine($"disposing {nameof(ServiceA)}, {_n}");
}

// 注册服务
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<INumberService, NumberService>();
        services.AddScoped<IServiceA, ServiceA>();
        
        Console.WriteLine("服务已注册，但尚未实例化");
    }
}

// 使用演示
public class LazyInstantiationDemo
{
    public void Demonstrate(IServiceProvider serviceProvider)
    {
        Console.WriteLine("开始演示...");
        
        // 此时还没有实例化任何服务
        Console.WriteLine("准备获取 ServiceA...");
        
        var serviceA = serviceProvider.GetService<IServiceA>();
        // 输出顺序：
        // 1. "创建 NumberService 实例"
        // 2. "ctor ServiceA, [随机数]"
        
        Console.WriteLine("ServiceA 已获取");
        serviceA.A();
    }
}
```

### 🔄 依赖链的实例化顺序
```csharp
public interface IRepositoryA { }
public interface IRepositoryB { }
public interface IServiceB { }

public class RepositoryA : IRepositoryA
{
    public RepositoryA()
    {
        Console.WriteLine("1. 创建 RepositoryA");
    }
}

public class RepositoryB : IRepositoryB
{
    public RepositoryB()
    {
        Console.WriteLine("2. 创建 RepositoryB");
    }
}

public class ServiceB : IServiceB
{
    public ServiceB(IRepositoryA repoA, IRepositoryB repoB)
    {
        Console.WriteLine("3. 创建 ServiceB");
    }
}

public class ServiceA : IServiceA
{
    public ServiceA(IServiceB serviceB, INumberService numberService)
    {
        Console.WriteLine("4. 创建 ServiceA");
    }
}

// 会先实例化 INumberService 和依赖链，再进入构造函数 ServiceA
```

---

## 高级依赖注入技术

### 🏭 工厂模式注入
```csharp
public interface IMessageProcessor
{
    void Process(string messageType, string content);
}

public class EmailProcessor : IMessageProcessor
{
    public void Process(string messageType, string content)
    {
        Console.WriteLine($"发送邮件: {content}");
    }
}

public class SmsProcessor : IMessageProcessor
{
    public void Process(string messageType, string content)
    {
        Console.WriteLine($"发送短信: {content}");
    }
}

// 工厂接口
public interface IMessageProcessorFactory
{
    IMessageProcessor CreateProcessor(string messageType);
}

// 工厂实现
public class MessageProcessorFactory : IMessageProcessorFactory
{
    private readonly IServiceProvider _serviceProvider;
    
    public MessageProcessorFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    
    public IMessageProcessor CreateProcessor(string messageType)
    {
        return messageType.ToLower() switch
        {
            "email" => _serviceProvider.GetService<EmailProcessor>(),
            "sms" => _serviceProvider.GetService<SmsProcessor>(),
            _ => throw new ArgumentException($"不支持的消息类型: {messageType}")
        };
    }
}

// 注册
services.AddScoped<EmailProcessor>();
services.AddScoped<SmsProcessor>();
services.AddScoped<IMessageProcessorFactory, MessageProcessorFactory>();
```

### 🔧 配置模式注入
```csharp
public class DatabaseSettings
{
    public string ConnectionString { get; set; }
    public int TimeoutSeconds { get; set; }
    public bool EnableLogging { get; set; }
}

public interface IDatabaseService
{
    void Connect();
}

public class DatabaseService : IDatabaseService
{
    private readonly DatabaseSettings _settings;
    
    public DatabaseService(IOptions<DatabaseSettings> settings)
    {
        _settings = settings.Value;
    }
    
    public void Connect()
    {
        Console.WriteLine($"连接数据库: {_settings.ConnectionString}");
        Console.WriteLine($"超时时间: {_settings.TimeoutSeconds}秒");
    }
}

// 配置和注册
public class Startup
{
    public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<DatabaseSettings>(configuration.GetSection("Database"));
        services.AddScoped<IDatabaseService, DatabaseService>();
    }
}
```

### 🎯 条件注入
```csharp
public interface ILogger
{
    void Log(string message);
}

public class FileLogger : ILogger
{
    public void Log(string message)
    {
        Console.WriteLine($"[文件日志] {message}");
    }
}

public class DatabaseLogger : ILogger
{
    public void Log(string message)
    {
        Console.WriteLine($"[数据库日志] {message}");
    }
}

public class ConsoleLogger : ILogger
{
    public void Log(string message)
    {
        Console.WriteLine($"[控制台日志] {message}");
    }
}

// 条件注册
public class Startup
{
    public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        string loggerType = configuration["LoggerType"];
        
        switch (loggerType?.ToLower())
        {
            case "file":
                services.AddSingleton<ILogger, FileLogger>();
                break;
            case "database":
                services.AddSingleton<ILogger, DatabaseLogger>();
                break;
            default:
                services.AddSingleton<ILogger, ConsoleLogger>();
                break;
        }
    }
}
```

### 🔀 多个实现的处理
```csharp
public interface INotificationService
{
    void SendNotification(string message);
}

public class EmailNotificationService : INotificationService
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"邮件通知: {message}");
    }
}

public class SmsNotificationService : INotificationService
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"短信通知: {message}");
    }
}

public class PushNotificationService : INotificationService
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"推送通知: {message}");
    }
}

// 组合服务
public class CompositeNotificationService
{
    private readonly IEnumerable<INotificationService> _notificationServices;
    
    public CompositeNotificationService(IEnumerable<INotificationService> notificationServices)
    {
        _notificationServices = notificationServices;
    }
    
    public void SendToAll(string message)
    {
        foreach (var service in _notificationServices)
        {
            service.SendNotification(message);
        }
    }
}

// 注册多个实现
services.AddScoped<INotificationService, EmailNotificationService>();
services.AddScoped<INotificationService, SmsNotificationService>();
services.AddScoped<INotificationService, PushNotificationService>();
services.AddScoped<CompositeNotificationService>();
```

---

## 实际应用场景

### 🌐 ASP.NET Core Web API
```csharp
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;
    
    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
    {
        try
        {
            _logger.LogInformation("创建订单请求: {@Request}", request);
            
            var order = await _orderService.CreateOrderAsync(request);
            
            _logger.LogInformation("订单创建成功: {OrderId}", order.Id);
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "创建订单失败");
            return BadRequest("创建订单失败");
        }
    }
}

// 业务服务
public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderRequest request);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentService _paymentService;
    private readonly IEmailService _emailService;
    
    public OrderService(
        IOrderRepository orderRepository,
        IPaymentService paymentService,
        IEmailService emailService)
    {
        _orderRepository = orderRepository;
        _paymentService = paymentService;
        _emailService = emailService;
    }
    
    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        // 创建订单
        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = request.CustomerId,
            Items = request.Items,
            TotalAmount = request.Items.Sum(x => x.Price * x.Quantity)
        };
        
        // 保存订单
        await _orderRepository.SaveAsync(order);
        
        // 处理支付
        await _paymentService.ProcessPaymentAsync(order);
        
        // 发送确认邮件
        await _emailService.SendOrderConfirmationAsync(order);
        
        return order;
    }
}
```

### 🔄 后台服务
```csharp
public class OrderProcessingService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OrderProcessingService> _logger;
    
    public OrderProcessingService(
        IServiceProvider serviceProvider,
        ILogger<OrderProcessingService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // 创建作用域
                using var scope = _serviceProvider.CreateScope();
                var orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();
                
                // 处理待处理的订单
                await ProcessPendingOrdersAsync(orderService);
                
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "处理订单时发生错误");
            }
        }
    }
    
    private async Task ProcessPendingOrdersAsync(IOrderService orderService)
    {
        // 处理逻辑
        _logger.LogInformation("处理待处理订单");
    }
}
```

---

## 性能优化

### ⚡ 避免服务定位器反模式
```csharp
// ❌ 错误方式：服务定位器反模式
public class BadOrderService
{
    private readonly IServiceProvider _serviceProvider;
    
    public BadOrderService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    
    public void ProcessOrder()
    {
        // 在方法中解析依赖
        var paymentService = _serviceProvider.GetService<IPaymentService>();
        var emailService = _serviceProvider.GetService<IEmailService>();
        
        // 处理逻辑...
    }
}

// ✅ 正确方式：构造函数注入
public class GoodOrderService
{
    private readonly IPaymentService _paymentService;
    private readonly IEmailService _emailService;
    
    public GoodOrderService(IPaymentService paymentService, IEmailService emailService)
    {
        _paymentService = paymentService;
        _emailService = emailService;
    }
    
    public void ProcessOrder()
    {
        // 直接使用注入的依赖
        // 处理逻辑...
    }
}
```

### 🎯 合理选择生命周期
```csharp
public class PerformanceOptimizedRegistration
{
    public void ConfigureServices(IServiceCollection services)
    {
        // 无状态、轻量级服务使用 Singleton
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddSingleton<IStringHasher, StringHasher>();
        
        // 有状态、需要隔离的服务使用 Scoped
        services.AddScoped<IUserContext, UserContext>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        // 需要每次新实例的服务使用 Transient
        services.AddTransient<IEmailMessage, EmailMessage>();
        services.AddTransient<INotificationBuilder, NotificationBuilder>();
    }
}
```

### 🔧 延迟初始化
```csharp
public class LazyInitializationExample
{
    private readonly Lazy<IExpensiveService> _expensiveService;
    
    public LazyInitializationExample(Lazy<IExpensiveService> expensiveService)
    {
        _expensiveService = expensiveService;
    }
    
    public void DoSomething()
    {
        if (SomeCondition())
        {
            // 只在需要时才初始化
            _expensiveService.Value.DoExpensiveOperation();
        }
    }
    
    private bool SomeCondition() => true;
}

// 注册延迟服务
services.AddSingleton<IExpensiveService, ExpensiveService>();
services.AddScoped<Lazy<IExpensiveService>>(provider =>
    new Lazy<IExpensiveService>(() => provider.GetRequiredService<IExpensiveService>()));
```

---

## 最佳实践

### ✅ 推荐做法

1. **使用接口进行抽象**
```csharp
// ✅ 好的做法
public interface IUserService
{
    Task<User> GetUserAsync(int id);
    Task<User> CreateUserAsync(CreateUserRequest request);
}

public class UserService : IUserService
{
    // 实现...
}

// 注册
services.AddScoped<IUserService, UserService>();
```

2. **避免循环依赖**
```csharp
// ❌ 错误：循环依赖
public class ServiceA
{
    public ServiceA(ServiceB serviceB) { }
}

public class ServiceB
{
    public ServiceB(ServiceA serviceA) { } // 循环依赖
}

// ✅ 正确：引入第三个服务或使用事件
public class ServiceA
{
    public ServiceA(ISharedService sharedService) { }
}

public class ServiceB
{
    public ServiceB(ISharedService sharedService) { }
}
```

3. **使用 IOptions 进行配置**
```csharp
public class MyService
{
    private readonly MyServiceOptions _options;
    
    public MyService(IOptions<MyServiceOptions> options)
    {
        _options = options.Value;
    }
}

// 配置
services.Configure<MyServiceOptions>(configuration.GetSection("MyService"));
```

4. **正确处理资源释放**
```csharp
public class DatabaseService : IDisposable
{
    private readonly DbConnection _connection;
    
    public DatabaseService(DbConnection connection)
    {
        _connection = connection;
    }
    
    public void Dispose()
    {
        _connection?.Dispose();
    }
}
```

### ⚠️ 常见陷阱

1. **避免在构造函数中执行复杂操作**
```csharp
// ❌ 错误
public class BadService
{
    public BadService(IDatabaseService db)
    {
        // 构造函数中执行I/O操作
        db.Initialize(); // 可能抛出异常
    }
}

// ✅ 正确
public class GoodService
{
    private readonly IDatabaseService _db;
    
    public GoodService(IDatabaseService db)
    {
        _db = db;
    }
    
    public async Task InitializeAsync()
    {
        await _db.InitializeAsync();
    }
}
```

2. **小心 Captive Dependencies**
```csharp
// ❌ 错误：Singleton 依赖 Scoped 服务
public class BadSingletonService
{
    public BadSingletonService(IScopedService scopedService)
    {
        // 这会导致 Scoped 服务变成 Singleton
    }
}

// ✅ 正确：使用 IServiceProvider 或 Factory
public class GoodSingletonService
{
    private readonly IServiceProvider _serviceProvider;
    
    public GoodSingletonService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    
    public void DoSomething()
    {
        using var scope = _serviceProvider.CreateScope();
        var scopedService = scope.ServiceProvider.GetRequiredService<IScopedService>();
        // 使用 scopedService
    }
}
```

---

## 总结

依赖注入是现代 .NET 应用程序的核心概念，它提供了：

- 🔄 **松耦合**：通过接口和抽象实现组件解耦
- 🧪 **可测试性**：易于进行单元测试和集成测试
- 🔧 **可配置性**：轻松切换不同的实现
- 📦 **生命周期管理**：自动管理对象的创建和销毁
- ⚡ **性能优化**：合理的生命周期选择提升性能

### 🎯 关键要点回顾

1. **依赖注入注册后，等需要用到后才会实例化**
2. **不同生命周期 Singleton、Transient、Scoped 各有用途**
3. **会先实例化依赖，再进入构造函数**
4. **合理选择生命周期是性能优化的关键**

掌握依赖注入可以让你构建更加灵活、可维护和可测试的应用程序。

🔗 **相关主题**: ASP.NET Core、单元测试、设计模式、架构设计、微服务
