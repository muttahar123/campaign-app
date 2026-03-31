-- Question 3: Write a SQL query to find the top 5 campaigns by ROAS for each client in the last 30 days

WITH CampaignROAS AS (
    SELECT 
        id,
        name,
        client,
        spend,
        conversions,
        CASE WHEN spend > 0 THEN (conversions::NUMERIC / spend) ELSE 0 END AS roas,
        ROW_NUMBER() OVER(
            PARTITION BY client 
            ORDER BY CASE WHEN spend > 0 THEN (conversions::NUMERIC / spend) ELSE 0 END DESC
        ) as client_rank
    FROM 
        campaigns
    WHERE 
        created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND deleted_at IS NULL
)
SELECT 
    id,
    name,
    client,
    spend,
    conversions,
    roas
FROM 
    CampaignROAS
WHERE 
    client_rank <= 5
ORDER BY 
    client ASC, 
    roas DESC;
