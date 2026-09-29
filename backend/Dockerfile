# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY ServerBTC.sln ./
COPY ServerBTC/ServerBTC.csproj ServerBTC/

RUN dotnet restore ServerBTC/ServerBTC.csproj

COPY ServerBTC/ ServerBTC/

WORKDIR /src/ServerBTC

RUN dotnet publish ServerBTC.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000

EXPOSE 5000

ENTRYPOINT ["dotnet", "ServerBTC.dll"]