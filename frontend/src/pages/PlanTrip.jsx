import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Move, Download, Share2, Sparkles, Save, Repeat, CheckCircle, IndianRupee } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function PlanTrip() {
  const location = useLocation();
  const searchParams = location.state || { whereTo: 'Generic Location', dates: 'Flexible', budget: 150000, travelers: 2 };
  const destinationInput = (searchParams.whereTo || '').toLowerCase();
  const calculateTripDays = (rawDates) => {
    const [left, right] = rawDates ? rawDates.split('-').map(s => s.trim()) : ['', ''];
    const start = new Date(left);
    const end = new Date(right);
    if (!left || !right || isNaN(start) || isNaN(end) || end < start) return 2;
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };
  const tripDays = calculateTripDays(searchParams.dates);
  const [planVersion, setPlanVersion] = useState(0);

  const randomShuffle = (items) => {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const destinationConfigs = [
    {
      key: 'beach',
      keywords: [/goa|bali|maldives|phuket|beach|shore|coast|boracay/i],
      titles: ['Beach Bliss', 'Island Escape', 'Sunset Explorer', 'Tropical Wellness'],
      templates: [
        { time: '06:30 AM', name: 'Sunrise Beach Walk', type: 'Nature', cost: 3200 },
        { time: '08:00 AM', name: 'Sunrise Beach Yoga', type: 'Wellness', cost: 4500 },
        { time: '09:30 AM', name: 'Market Stroll Along the Shore', type: 'Culture', cost: 2800 },
        { time: '10:30 AM', name: 'Island Hopping Adventure', type: 'Adventure', cost: 9200 },
        { time: '11:00 AM', name: 'Local Fishing Village Visit', type: 'Culture', cost: 4700 },
        { time: '12:30 PM', name: 'Seafood Lunch by the Pier', type: 'Food', cost: 7200 },
        { time: '01:30 PM', name: 'Coastal Village Tour', type: 'Culture', cost: 4600 },
        { time: '02:30 PM', name: 'Coral Snorkeling Session', type: 'Adventure', cost: 8700 },
        { time: '03:00 PM', name: 'Tropical Garden Walk', type: 'Nature', cost: 5200 },
        { time: '03:30 PM', name: 'Mangrove Kayak Tour', type: 'Adventure', cost: 8100 },
        { time: '04:00 PM', name: 'Sunset Sailing Cruise', type: 'Romantic', cost: 12000 },
        { time: '05:00 PM', name: 'Cliffside Sunset Viewpoint', type: 'Sightseeing', cost: 2100 },
        { time: '06:00 PM', name: 'Beachfront Dinner Under Lanterns', type: 'Food', cost: 7800 },
        { time: '06:30 PM', name: 'Traditional Dance & Dinner Show', type: 'Culture', cost: 7600 },
        { time: '07:30 PM', name: 'Night Beach Bonfire Experience', type: 'Evening', cost: 5400 },
        { time: '08:30 PM', name: 'Night Market Street Food Crawl', type: 'Culture', cost: 3400 }
      ]
    },
    {
      key: 'japan',
      keywords: [/japan|tokyo|kyoto|osaka|hokkaido|kyushu|sapporo/i],
      titles: ['Tokyo Discovery', 'Kyoto Culture', 'Osaka Nights', 'Island Serenity'],
      templates: [
        { time: '08:00 AM', name: 'Temples and Tea Ceremony', type: 'Culture', cost: 5600 },
        { time: '09:30 AM', name: 'City Shrine Walk', type: 'Culture', cost: 4200 },
        { time: '11:00 AM', name: 'Sushi Market Brunch', type: 'Food', cost: 6500 },
        { time: '12:30 PM', name: 'Anime District Exploration', type: 'Culture', cost: 4700 },
        { time: '02:00 PM', name: 'Bamboo Forest Stroll', type: 'Nature', cost: 3900 },
        { time: '03:30 PM', name: 'Zen Garden Visit', type: 'Culture', cost: 4400 },
        { time: '05:00 PM', name: 'City Skyline Evening', type: 'Sightseeing', cost: 5200 },
        { time: '06:30 PM', name: 'Izakaya Dinner Experience', type: 'Food', cost: 7600 }
      ]
    },
    {
      key: 'italy',
      keywords: [/italy|rome|florence|venice|milan|tuscany|naples|sicily/i],
      titles: ['Roman Holiday', 'Tuscan Escape', 'Venetian Canals', 'Amalfi Delights'],
      templates: [
        { time: '08:30 AM', name: 'Espresso and Pastry Start', type: 'Food', cost: 4300 },
        { time: '09:30 AM', name: 'Historic Plaza Walk', type: 'Culture', cost: 5200 },
        { time: '11:00 AM', name: 'Cathedral Tour', type: 'Culture', cost: 4800 },
        { time: '12:30 PM', name: 'Pasta Lunch in a Piazza', type: 'Food', cost: 7100 },
        { time: '02:00 PM', name: 'Canal Boat Ride', type: 'Sightseeing', cost: 5800 },
        { time: '03:30 PM', name: 'Winery Tasting Session', type: 'Food', cost: 6700 },
        { time: '05:00 PM', name: 'Sunset Villa Stroll', type: 'Sightseeing', cost: 4500 },
        { time: '06:30 PM', name: 'Seafood Dinner by the Coast', type: 'Food', cost: 8200 }
      ]
    },
    {
      key: 'australia',
      keywords: [/australia|sydney|melbourne|perth|brisbane|gold coast|cairns|byron bay/i],
      titles: ['Sydney Shores', 'Melbourne Culture', 'Outback Escape', 'Coastal Adventure'],
      templates: [
        { time: '08:00 AM', name: 'Harbor Breakfast Walk', type: 'Food', cost: 5200 },
        { time: '09:30 AM', name: 'Coastal Cliff Walk', type: 'Nature', cost: 4200 },
        { time: '11:00 AM', name: 'Wildlife Sanctuary Visit', type: 'Nature', cost: 6300 },
        { time: '12:30 PM', name: 'Beachside Lunch', type: 'Food', cost: 5600 },
        { time: '02:00 PM', name: 'Surf Lesson', type: 'Adventure', cost: 7100 },
        { time: '03:30 PM', name: 'Botanic Garden Tour', type: 'Culture', cost: 4500 },
        { time: '05:00 PM', name: 'Sunset Beach Picnic', type: 'Sightseeing', cost: 3800 },
        { time: '06:30 PM', name: 'Seafood Night Market', type: 'Food', cost: 7800 }
      ]
    },
    {
      key: 'north india',
      keywords: [/north india|delhi|agra|jaipur|varanasi|uttar pradesh|rajasthan|himachal|shimla|manali|amritsar|leh|kashmir/i],
      titles: ['Golden Triangle', 'Rajasthan Heritage', 'Himalayan Escape', 'Sacred Varanasi'],
      templates: [
        { time: '07:00 AM', name: 'Sunrise at a Historic Fort', type: 'Culture', cost: 4200 },
        { time: '08:30 AM', name: 'Spice Market Exploration', type: 'Culture', cost: 3900 },
        { time: '10:00 AM', name: 'Royal Palace Guided Tour', type: 'Culture', cost: 5300 },
        { time: '11:30 AM', name: 'City Monument Photo Walk', type: 'Sightseeing', cost: 3400 },
        { time: '12:30 PM', name: 'Local North Indian Thali Lunch', type: 'Food', cost: 4700 },
        { time: '02:00 PM', name: 'Temple and Ghat Walk', type: 'Sightseeing', cost: 3100 },
        { time: '03:30 PM', name: 'Heritage Haveli Visit', type: 'Culture', cost: 4500 },
        { time: '05:00 PM', name: 'Sunset on a River Ghat', type: 'Sightseeing', cost: 3200 },
        { time: '06:30 PM', name: 'Evening Classical Dance Show', type: 'Entertainment', cost: 5400 },
        { time: '08:00 PM', name: 'Rajasthani Folk Dinner', type: 'Food', cost: 6200 },
        { time: '09:30 AM', name: 'Himalayan Hill Station Drive', type: 'Nature', cost: 4100 },
        { time: '11:00 AM', name: 'Amritsar Golden Temple Visit', type: 'Culture', cost: 4800 }
      ]
    },
    {
      key: 'south india',
      keywords: [/south india|south indian|kerala|goa|bangalore|chennai|hyderabad|cochin|kochi|kozhikode|madurai|pondicherry|ooty|mysore|vellore|trivandrum/i],
      titles: ['Kerala Backwaters', 'Coastal South India', 'Temple Trail', 'Spice Coast'],
      templates: [
        { time: '08:00 AM', name: 'Backwater Boat Cruise', type: 'Nature', cost: 5200 },
        { time: '09:30 AM', name: 'Beachfront Breakfast', type: 'Food', cost: 3600 },
        { time: '11:00 AM', name: 'Ancient Temple Visit', type: 'Culture', cost: 4200 },
        { time: '12:30 PM', name: 'South Indian Thali Lunch', type: 'Food', cost: 4700 },
        { time: '02:00 PM', name: 'Spice Garden Walk', type: 'Culture', cost: 3900 },
        { time: '03:30 PM', name: 'Colonial Fort Tour', type: 'Culture', cost: 4300 },
        { time: '05:00 PM', name: 'Sunset Beach Stroll', type: 'Sightseeing', cost: 3100 },
        { time: '06:30 PM', name: 'Kathakali or Carnatic Show', type: 'Entertainment', cost: 5400 },
        { time: '08:00 AM', name: 'Tea Plantation Walk', type: 'Nature', cost: 3800 },
        { time: '09:30 AM', name: 'Heritage Palace Visit', type: 'Culture', cost: 4500 },
        { time: '11:00 AM', name: 'Local Fishing Village Tour', type: 'Culture', cost: 4400 },
        { time: '01:00 PM', name: 'Spice Route Cooking Class', type: 'Food', cost: 5600 }
      ]
    },
    {
      key: 'india',
      keywords: [/india/i],
      titles: ['Indian Highlights', 'Heritage Journey', 'Cultural India', 'Spice Route'],
      templates: [
        { time: '08:00 AM', name: 'Monument Sunrise Tour', type: 'Culture', cost: 4200 },
        { time: '09:30 AM', name: 'Street Food Breakfast', type: 'Food', cost: 3600 },
        { time: '11:00 AM', name: 'Historic Fort Exploration', type: 'Culture', cost: 5200 },
        { time: '12:30 PM', name: 'Local Thali Lunch', type: 'Food', cost: 4700 },
        { time: '02:00 PM', name: 'Spice Market Walk', type: 'Culture', cost: 3900 },
        { time: '03:30 PM', name: 'Temple or Palace Visit', type: 'Culture', cost: 4300 },
        { time: '05:00 PM', name: 'River Ghat Sunset', type: 'Sightseeing', cost: 3100 },
        { time: '06:30 PM', name: 'Evening Cultural Performance', type: 'Entertainment', cost: 5400 }
      ]
    },
    {
      key: 'usa',
      keywords: [/usa|united states|america|new york|los angeles|san francisco|miami|las vegas|chicago|washington/i],
      titles: ['Iconic U.S. Stops', 'Coast-to-Coast', 'Urban Adventure', 'Great Outdoors'],
      templates: [
        { time: '08:00 AM', name: 'City Brunch Experience', type: 'Food', cost: 5200 },
        { time: '09:30 AM', name: 'Landmark Photo Tour', type: 'Sightseeing', cost: 6100 },
        { time: '11:00 AM', name: 'Museum Exploration', type: 'Culture', cost: 5400 },
        { time: '12:30 PM', name: 'Local Food Truck Lunch', type: 'Food', cost: 4700 },
        { time: '02:00 PM', name: 'National Park Walk', type: 'Nature', cost: 6500 },
        { time: '03:30 PM', name: 'Street Music and Art', type: 'Culture', cost: 4200 },
        { time: '05:00 PM', name: 'Skyline Sunset View', type: 'Sightseeing', cost: 5000 },
        { time: '06:30 PM', name: 'Dinner at a Local Favorite', type: 'Food', cost: 7800 }
      ]
    },
    {
      key: 'city',
      keywords: [/paris|london|barcelona|dubai|singapore|city|urban|metropolis/i],
      titles: ['Arrival & Exploration', 'Local Highlights', 'Signature Moments', 'Relax & Discover'],
      templates: [
        { time: '08:30 AM', name: 'City Breakfast Café Crawl', type: 'Food', cost: 5200 },
        { time: '09:30 AM', name: 'Landmark Walking Tour', type: 'Culture', cost: 9000 },
        { time: '10:30 AM', name: 'Café Brunch in the Quarter', type: 'Food', cost: 7600 },
        { time: '11:30 AM', name: 'Botanical Garden Visit', type: 'Nature', cost: 4300 },
        { time: '12:30 PM', name: 'Art Gallery Immersion', type: 'Culture', cost: 5200 },
        { time: '01:30 PM', name: 'Historic Café Tasting Tour', type: 'Food', cost: 5800 },
        { time: '02:30 PM', name: 'Historic District Cycling', type: 'Adventure', cost: 5600 },
        { time: '03:00 PM', name: 'Street Food Market Safari', type: 'Food', cost: 4900 },
        { time: '03:30 PM', name: 'Riverside Promenade Walk', type: 'Sightseeing', cost: 4800 },
        { time: '04:00 PM', name: 'Luxury Shopping Avenue', type: 'Shopping', cost: 7800 },
        { time: '05:00 PM', name: 'Street Art & Photography Tour', type: 'Culture', cost: 4100 },
        { time: '06:00 PM', name: 'Sunset Skyline Lounge', type: 'Nightlife', cost: 7200 },
        { time: '07:30 PM', name: 'Rooftop Gallery Visit', type: 'Culture', cost: 6100 },
        { time: '08:00 PM', name: 'River Dinner Cruise', type: 'Food', cost: 11500 },
        { time: '09:30 PM', name: 'Hidden Speakeasy Experience', type: 'Nightlife', cost: 6600 },
        { time: '10:30 PM', name: 'Local Music & Jazz Evening', type: 'Nightlife', cost: 6500 }
      ]
    },
    {
      key: 'safari',
      keywords: [/safari|wildlife|kenya|tanzania|amazon|adventure|trek|mountain|hike|camp/i],
      titles: ['Wild Adventure', 'Explorer’s Trek', 'Savannah Discovery', 'Nature Expedition'],
      templates: [
        { time: '06:00 AM', name: 'Morning Wildlife Call Session', type: 'Nature', cost: 4400 },
        { time: '07:00 AM', name: 'Sunrise Safari Drive', type: 'Adventure', cost: 13000 },
        { time: '08:30 AM', name: 'Birdwatching Expedition', type: 'Nature', cost: 4800 },
        { time: '09:30 AM', name: 'Nature Trail Hike', type: 'Adventure', cost: 5600 },
        { time: '10:30 AM', name: 'River Canoe Discovery', type: 'Adventure', cost: 5800 },
        { time: '11:30 AM', name: 'Wildlife Photography Session', type: 'Adventure', cost: 7200 },
        { time: '12:30 PM', name: 'Traditional Bush Lunch', type: 'Food', cost: 5400 },
        { time: '01:30 PM', name: 'Bush Lunch by the River', type: 'Food', cost: 6700 },
        { time: '02:30 PM', name: 'Village Culture Walk', type: 'Culture', cost: 5200 },
        { time: '03:30 PM', name: 'Herbal Farm Visit', type: 'Culture', cost: 4300 },
        { time: '04:30 PM', name: 'Waterfall Relaxation Session', type: 'Nature', cost: 4700 },
        { time: '05:00 PM', name: 'Sunset Campfire Gathering', type: 'Evening', cost: 4500 }
      ]
    },
    {
      key: 'canada',
      keywords: [/canada|toronto|vancouver|montreal|banff|rockies|niagara|ottawa|quebec|calgary/i],
      titles: ['Maple Escape', 'Northern Adventure', 'Canadian Highlights', 'Great Outdoors'],
      templates: [
        { time: '08:00 AM', name: 'Breakfast at a Local Café', type: 'Food', cost: 4200 },
        { time: '09:30 AM', name: 'Historic City Walking Tour', type: 'Culture', cost: 5300 },
        { time: '11:00 AM', name: 'Scenic Lakefront Stroll', type: 'Nature', cost: 3200 },
        { time: '12:30 PM', name: 'Maple Market Lunch', type: 'Food', cost: 4700 },
        { time: '02:00 PM', name: 'National Park Hike', type: 'Adventure', cost: 6600 },
        { time: '03:30 PM', name: 'Mountain Panorama View', type: 'Sightseeing', cost: 3900 },
        { time: '05:00 PM', name: 'Wildlife Lookout', type: 'Nature', cost: 3400 },
        { time: '06:30 PM', name: 'Freeze-Dried Camp Dinner', type: 'Food', cost: 4500 },
        { time: '08:00 PM', name: 'Northern Lights Talk', type: 'Culture', cost: 3600 },
        { time: '09:30 AM', name: 'Local Brewery Tasting', type: 'Food', cost: 5200 },
        { time: '10:30 AM', name: 'Art District Gallery Visit', type: 'Culture', cost: 5300 },
        { time: '01:00 PM', name: 'Riverboat History Cruise', type: 'Sightseeing', cost: 6100 }
      ]
    },
    {
      key: 'default',
      keywords: [/.*/],
      titles: ['Arrival & Exploration', 'Local Highlights', 'Signature Moments', 'Relax & Discover'],
      templates: [
        { time: '08:00 AM', name: 'Sunrise Walking Tour', type: 'Culture', cost: 4500 },
        { time: '09:00 AM', name: 'Local Bakery Tasting', type: 'Food', cost: 4200 },
        { time: '09:30 AM', name: 'Local Market Exploration', type: 'Culture', cost: 2500 },
        { time: '10:30 AM', name: 'River Cruise', type: 'Adventure', cost: 8200 },
        { time: '11:30 AM', name: 'Artisan Workshop Class', type: 'Culture', cost: 4900 },
        { time: '12:30 PM', name: 'Cultural Heritage Visit', type: 'Culture', cost: 5000 },
        { time: '01:30 PM', name: 'Street Food Discovery', type: 'Food', cost: 5500 },
        { time: '02:30 PM', name: 'Street Art & Gallery Walk', type: 'Culture', cost: 4700 },
        { time: '03:30 PM', name: 'Botanical Garden Stroll', type: 'Nature', cost: 4200 },
        { time: '04:30 PM', name: 'Sunset Viewpoint Visit', type: 'Sightseeing', cost: 4200 },
        { time: '05:30 PM', name: 'Rooftop Cocktail Experience', type: 'Food', cost: 9000 },
        { time: '06:30 PM', name: 'Riverfront Dinner', type: 'Food', cost: 7800 },
        { time: '07:30 PM', name: 'Local Evening Market Walk', type: 'Culture', cost: 3300 },
        { time: '08:30 PM', name: 'Night Food Truck Tour', type: 'Food', cost: 3600 },
        { time: '09:30 PM', name: 'Evening City Lights Drive', type: 'Sightseeing', cost: 4100 }
      ]
    }
  ];

  const getDestinationCategory = (dest) => {
    const normalized = dest ? dest.toLowerCase() : '';
    const match = destinationConfigs.find((config) =>
      config.key !== 'default' && config.keywords.some((regex) => regex.test(normalized))
    );
    return match ? match.key : 'default';
  };

  const getDestinationTemplates = (dest) => {
    const category = getDestinationCategory(dest);
    return destinationConfigs.find((config) => config.key === category).templates;
  };

  const getDestinationTitles = (dest) => {
    const category = getDestinationCategory(dest);
    return destinationConfigs.find((config) => config.key === category).titles;
  };

  const generateActivities = (dest, count, excludedNames = new Set()) => {
    const templates = getDestinationTemplates(dest);
    const available = randomShuffle(templates).filter(activity => !excludedNames.has(activity.name));
    const chosen = available.slice(0, count);

    if (chosen.length < count) {
      const missing = count - chosen.length;
      const remaining = templates.filter(activity => !chosen.some(chosenAct => chosenAct.name === activity.name));
      const filler = randomShuffle(remaining).slice(0, missing);
      chosen.push(...filler);
    }

    if (chosen.length < count) {
      const suffixes = new Set();
      while (chosen.length < count) {
        const base = templates[chosen.length % templates.length];
        const suffix = suffixes.size + 1;
        const uniqueName = `${base.name} (${suffix})`;
        if (!excludedNames.has(uniqueName) && !chosen.some(activity => activity.name === uniqueName)) {
          chosen.push({ ...base, name: uniqueName });
          suffixes.add(suffix);
        }
      }
    }

    return chosen.map((activity, index) => ({ ...activity, id: index + 1 }));
  };

  const generatePlan = (count) => {
    const titles = getDestinationTitles(destinationInput);
    const usedNames = new Set();

    return Array.from({ length: count }, (_, idx) => {
      const activities = generateActivities(destinationInput, 4, usedNames);
      activities.forEach(activity => usedNames.add(activity.name));
      return {
        day: idx + 1,
        title: titles[idx % titles.length],
        activities
      };
    });
  };

  const [budget] = useState(Number(searchParams.budget) || 150000);
  const [days, setDays] = useState([]);
  const [spent, setSpent] = useState(0);
  const [showToast, setShowToast] = useState('');
  const [dateError, setDateError] = useState('');

  const parseRange = (raw) => {
    if (!raw || !raw.includes('-')) return { start: '', end: '' };
    const [left, right] = raw.split('-').map(s => s.trim());
    const start = isNaN(new Date(left)) ? '' : new Date(left).toISOString().slice(0, 10);
    const end = isNaN(new Date(right)) ? '' : new Date(right).toISOString().slice(0, 10);
    return { start, end };
  };

  const formatDateLabel = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return isNaN(date) ? '' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const initialRange = parseRange(searchParams.dates);
  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);

  const selectedDates = startDate && endDate ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}` : (searchParams.dates || 'Flexible Range');

  const handleStartDateChange = (value) => {
    if (endDate && value > endDate) {
      setEndDate(value);
    }
    setStartDate(value);
    setDateError('');
  };

  const handleEndDateChange = (value) => {
    if (startDate && value < startDate) {
      setDateError('End date must be on or after the start date.');
      return;
    }
    setEndDate(value);
    setDateError('');
  };

  // Drag and drop state
  const dragItem = useRef();
  const dragNode = useRef();

  // Drag and Drop Logic
  const handleDragStart = (e, params) => {
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    // Timeout keeps visual active while dragging
    setTimeout(() => setDays([...days]), 0);
  };

  const handleDragEnter = (e, params) => {
    const currentItem = dragItem.current;
    if (e.target !== dragNode.current) {
        setDays(oldDays => {
           let newDays = JSON.parse(JSON.stringify(oldDays));
           // Get dragged item
           const item = newDays[currentItem.dayIndex].activities.splice(currentItem.actIndex, 1)[0];
           // Insert at newly entered position
           newDays[params.dayIndex].activities.splice(params.actIndex, 0, item);
           // Update index references
           dragItem.current = params;
           return newDays;
        });
    }
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    if (dragNode.current) {
       dragNode.current.removeEventListener('dragend', handleDragEnd);
       dragNode.current = null;
    }
    setDays([...days]);
  };

  useEffect(() => {
    setDays(generatePlan(tripDays));
  }, [tripDays, destinationInput, planVersion]);

  useEffect(() => {
    let total = days.reduce((acc, currentDay) => acc + currentDay.activities.reduce((sum, act) => sum + act.cost, 0), 0);
    setSpent(total);
  }, [days]);

  const regeneratePlan = () => {
    setPlanVersion(prev => prev + 1);
    setShowToast('Regenerating itinerary...');
    setTimeout(() => {
      setShowToast('Your new itinerary is ready!');
      setTimeout(() => setShowToast(''), 2500);
    }, 500);
  };

  const optimizeBudget = () => {
    setDays(prev => prev.map(d => ({
      ...d,
      activities: d.activities.map(a => ({
        ...a,
        cost: Math.max(Math.floor(a.cost * 0.8), 500),
        name: a.name.includes('(Optimized)') ? a.name : `${a.name} (Optimized)`
      }))
    })));
    setShowToast('Budget optimized with cheaper alternatives.');
    setTimeout(() => setShowToast(''), 3000);
  };

  const shareTrip = async () => {
    const message = `Check out my itinerary for ${searchParams.whereTo || 'your destination'}: ${selectedDates}. ${searchParams.travelers} Travelers.`;
    const payload = `${message}\n${window.location.href}`;

    const fallbackCopy = (text) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        success = false;
      }
      document.body.removeChild(textarea);
      return success;
    };

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Itinerary for ${searchParams.whereTo || 'Your Trip'}`,
          text: message,
          url: window.location.href
        });
        setShowToast('Shared successfully!');
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(payload);
        setShowToast('Trip copied to clipboard!');
      } else if (fallbackCopy(payload)) {
        setShowToast('Trip copied to clipboard!');
      } else {
        window.alert(`Copy the trip details manually:\n\n${payload}`);
        setShowToast('Use manual copy to share.');
      }
    } catch (error) {
      if (fallbackCopy(payload)) {
        setShowToast('Trip copied to clipboard!');
      } else {
        window.alert(`Copy the trip details manually:\n\n${payload}`);
        setShowToast('Clipboard not available. Use manual copy.');
      }
    }
    setTimeout(() => setShowToast(''), 3000);
  };

  const exportPDF = async () => {
    setShowToast('Generating PDF...');
    const element = document.getElementById('timeline-pdf-export');
    if (!element) {
      setShowToast('Export failed.');
      setTimeout(() => setShowToast(''), 3000);
      return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('itinerary.pdf');
      setShowToast('PDF exported!');
    } catch (error) {
      setShowToast('PDF export failed. Please try again.');
    }
    setTimeout(() => setShowToast(''), 3000);
  };

  const saveToDashboard = () => {
    const trip = {
      id: Date.now(),
      destination: searchParams.whereTo || 'Unknown',
      dates: selectedDates,
      travelers: searchParams.travelers,
      budget: searchParams.budget,
      totalCost: spent,
      itinerary: days
    };

    try {
      const saved = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      localStorage.setItem('savedTrips', JSON.stringify([trip, ...saved]));
      setShowToast('Trip saved to dashboard.');
    } catch (error) {
      setShowToast('Unable to save trip locally.');
    }
    setTimeout(() => setShowToast(''), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '100px 5% 4rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {showToast && (
        <div className="glass animate-fade-in" style={{ position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderLeft: '4px solid var(--accent)', background: 'var(--surface-color)', borderRadius: '10px' }}>
          <CheckCircle size={24} color="var(--accent)" /> <span style={{ fontWeight: 600 }}>{showToast}</span>
        </div>
      )}

      {/* Sidebar Controls */}
      <div style={{ flex: '1 1 300px' }}>
        <div className="glass" style={{ padding: '2.5rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <Sparkles color="var(--primary)" size={28}/> Itinerary Builder
          </h2>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Real-time Budget</span>
              <span style={{ fontWeight: 800, color: spent > budget ? '#ef4444' : 'var(--primary)' }}>₹{spent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((spent/budget)*100, 100)}%`, height: '100%', background: spent > budget ? '#ef4444' : 'linear-gradient(to right, var(--primary), var(--accent))', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Trip Dates</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{ padding: '0.8rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{ padding: '0.8rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={regeneratePlan} className="btn-primary" style={{ width: '100%' }}><Repeat size={20} /> AI Regenerate Plan</button>
            <button onClick={optimizeBudget} className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}><IndianRupee size={20} /> Optimize Budget</button>
            <button onClick={exportPDF} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}><Download size={20} /> Export PDF</button>
            <button onClick={shareTrip} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}><Share2 size={20} /> Share Trip</button>
            <button onClick={saveToDashboard} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', borderColor: 'var(--secondary)', color: 'var(--text-primary)' }}><Save size={20} /> Save to Dashboard</button>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div style={{ flex: '3 1 600px' }} id="timeline-pdf-export">
        <div className="glass" style={{ padding: '3rem', background: 'var(--surface-color)', borderTop: '5px solid var(--primary)', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ minWidth: '250px' }}>
              <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-primary)' }}>Experience {searchParams.whereTo || 'Unknown'}</h1>
              <p style={{ margin: '0.6rem 0 0', color: 'var(--text-muted)' }}>Select your travel window to update the itinerary range.</p>
            </div>
            <div style={{ textAlign: 'right', minWidth: '220px' }}>
               <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>{selectedDates}</p>
               <p style={{ margin: 0, color: 'var(--text-muted)' }}>{searchParams.travelers} Travelers</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)' }}>
              Start Date
              <input
                type="date"
                value={startDate}
                onChange={e => handleStartDateChange(e.target.value)}
                style={{ padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)' }}>
              End Date
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={e => handleEndDateChange(e.target.value)}
                style={{ padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
              />
            </label>
          </div>
          {dateError && <p style={{ color: '#fb7185', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>{dateError}</p>}

          <div className="timeline-container">
            {days.map((d, dayIndex) => (
              <div key={d.day} className="timeline-day">
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalendarIcon size={24} color="var(--primary)" /> Day {d.day}: <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{d.title}</span>
                </h3>
                
                {d.activities.map((act, actIndex) => (
                  <div 
                    key={act.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, {dayIndex, actIndex})}
                    onDragEnter={(e) => handleDragEnter(e, {dayIndex, actIndex})}
                    className={`activity-card glass ${dragItem.current?.dayIndex === dayIndex && dragItem.current?.actIndex === actIndex ? 'dragging' : ''}`} 
                    style={{ background: 'var(--bg-color)', cursor: 'grab' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      <Move size={20} color="var(--primary)" style={{ cursor: 'grab' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem', color:'var(--text-primary)' }}>{act.name}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <span style={{ display:'flex', alignItems:'center', gap:'0.2rem'}}><Clock size={12} /> {act.time}</span> 
                          <span style={{ background: 'rgba(255,255,255,0.05)', padding:'0.2rem 0.6rem', borderRadius:'8px', color: 'var(--primary)' }}>{act.type}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                      ₹{act.cost.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanTrip;
