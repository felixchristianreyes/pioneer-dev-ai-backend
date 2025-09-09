# Pioneer Dev AI Backend

## Getting Started

### Running the Development Server
```bash
npm run dev
```

### Environment Setup
Follow the `.env.example` file to configure your environment variables.

## API Limitations & Design Decisions

### Missing Data Fields
- **Ratings**: Not directly available in the Places API response, so this field has been omitted for now
- **Operating Hours**: Not directly available in the Places API response, so this field has been omitted for now

### Rating Filter Challenge
The Places API has a limit of 50 results per request. When implementing the "at least X ratings" filter, we encountered an edge case:

- The API response doesn't include a `rating` field that we can use for filtering
- If we filtered the 50 returned items and none met the minimum rating requirement, we would return no results
- While we could throw a "no restaurants found" error, this might make the API appear broken