import VisitorSession from '../../models/VisitorSession.js';

export async function getAnalytics(_req, res, next) {
  try {
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
    const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 7);
    const startOf30    = new Date(now); startOf30.setDate(now.getDate() - 30);

    const [
      total,
      todayCount,
      weekCount,
      deviceStats,
      browserStats,
      referrerStats,
      sectionStats,
      avgDurationResult,
      dailyVisits,
      recent,
    ] = await Promise.all([
      VisitorSession.countDocuments(),
      VisitorSession.countDocuments({ startedAt: { $gte: startOfToday } }),
      VisitorSession.countDocuments({ startedAt: { $gte: startOfWeek } }),
      VisitorSession.aggregate([{ $group: { _id: '$device',       count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      VisitorSession.aggregate([{ $group: { _id: '$browser',      count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]),
      VisitorSession.aggregate([{ $group: { _id: '$referrerType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      VisitorSession.aggregate([
        { $unwind: '$sections' },
        { $group: { _id: '$sections.slug', views: { $sum: 1 }, avgDuration: { $avg: '$sections.duration' } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
      VisitorSession.aggregate([{ $group: { _id: null, avg: { $avg: '$duration' } } }]),
      VisitorSession.aggregate([
        { $match: { startedAt: { $gte: startOf30 } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$startedAt' } },
          count: { $sum: 1 },
        }},
        { $sort: { _id: 1 } },
      ]),
      VisitorSession.find({})
        .sort({ startedAt: -1 })
        .limit(20)
        .select('sessionId startedAt duration device browser os referrer referrerType sections')
        .lean(),
    ]);

    // Fill in missing days for the chart
    const dailyMap = Object.fromEntries(dailyVisits.map((d) => [d._id, d.count]));
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      chartData.push({ date: key, count: dailyMap[key] || 0 });
    }

    res.json({
      overview: {
        total,
        today: todayCount,
        thisWeek: weekCount,
        avgDuration: Math.round(avgDurationResult[0]?.avg || 0),
      },
      deviceBreakdown:   deviceStats.map((d) => ({ name: d._id || 'Unknown', value: d.count })),
      browserBreakdown:  browserStats.map((d) => ({ name: d._id || 'Unknown', value: d.count })),
      referrerBreakdown: referrerStats.map((d) => ({ name: d._id || 'unknown', value: d.count })),
      topSections:       sectionStats.map((d) => ({ slug: d._id, views: d.views, avgDuration: Math.round(d.avgDuration || 0) })),
      chartData,
      recent,
    });
  } catch (err) {
    next(err);
  }
}
